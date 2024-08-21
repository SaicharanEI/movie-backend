import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  UseFilters,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MulterInterceptor } from "../../common/interceptor/multer-interceptor";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateMovieDto } from "./dto/update-movie";
import { HttpExceptionFilter } from "src/filter/http-exception.filter";
import { RedisService } from "../redis/redis.service";

@Controller("movies")
@ApiTags("movies")
@ApiBearerAuth("access-token")
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(
    private movieService: MovieService,
    private readonly redisService: RedisService
  ) {}
  @Post()
  @ApiOperation({ summary: "Create movie" })
  @ApiBody({
    schema: {
      example: {
        title: "The Matrix",
        publishedYear: 1999,
        image: "image.png",
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "The movie has been successfully created.",
  })
  @UseInterceptors(MulterInterceptor)
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req
  ) {
    createMovieDto.publishedYear = Number(createMovieDto.publishedYear);
    if (!createMovieDto || !image) {
      throw new BadRequestException("Invalid data");
    }
    const { title, publishedYear } = createMovieDto;
    const userId = req.user.sub;
    const movieData = {
      title,
      publishedYear,
      image: image?.filename,
      userId,
    };

    const movie = await this.movieService.createMovie(movieData);
    if (movie) {
      await this.redisService.delByPattern(`movies_list:${userId}:*`);
      return {
        status: 201,
        message: "Movie successfully created",
      };
    }
  }

  @Get()
  @UseInterceptors(MulterInterceptor)
  @ApiOperation({ summary: "Get all movies" })
  @ApiResponse({
    schema: {
      example: {
        status: 200,
        data: [
          {
            _id: "5f9f1b5b8f0b2c0b0b0b0b0b",
            title: "Avengers",
            publishedYear: 2019,
            image: "5f9f1b5b8f0b2c0b0b0b0b0b",
            userId: "5f9f1b5b8f0b2c0b0b0b0b0b",
            __v: 0,
          },
        ],
      },
    },
  })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "8",
    @Request() req
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const userId = req.user.sub;

    const cacheKey = `movies_list:${userId}:page=${pageNumber}:limit=${limitNumber}`;

    const cachedMovies = await this.redisService.get(cacheKey);
    if (cachedMovies) {
      return {
        status: 200,
        data: JSON.parse(cachedMovies),
      };
    }

    const movies = await this.movieService.findAll(
      pageNumber,
      limitNumber,
      userId
    );

    await this.redisService.setEx(cacheKey, 900, JSON.stringify(movies));

    return {
      status: 200,
      data: movies,
    };
  }
  @Get(":id")
  @ApiOperation({ summary: "Get movie by id" })
  @ApiResponse({
    schema: {
      example: {
        status: 200,
        data: {
          _id: "5f9f1b5b8f0b2c0b0b0b0b0b",
          title: "Avengers",
          publishedYear: 2019,
          image: "5f9f1b5b8f0b2c0b0b0b0b0b",
          userId: "5f9f1b5b8f0b2c0b0b0b0b0b",
          __v: 0,
        },
      },
    },
  })
  @UseInterceptors(MulterInterceptor)
  async findById(@Param("id") id: string) {
    const cachedMovie = await this.redisService.get(`movie:${id}`);
    if (cachedMovie) {
      return {
        status: 200,
        data: JSON.parse(cachedMovie),
      };
    }
    const movie = await this.movieService.findById(id);

    await this.redisService.setEx(`movie:${id}`, 900, JSON.stringify(movie));

    return {
      status: 200,
      data: movie,
    };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update movie" })
  @ApiResponse({
    schema: {
      example: {
        status: 200,
        message: "Movie details Updated",
        data: {
          _id: "5f9f1b5b8f0b2c0b0b0b0b0b",
          title: "Avengers",
          publishedYear: 2019,
          image: "5f9f1b5b8f0b2c0b0b0b0b0b",
          userId: "5f9f1b5b8f0b2c0b0b0b0b0b",
          __v: 0,
        },
      },
    },
  })
  @UseInterceptors(MulterInterceptor)
  async update(
    @Param("id") id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req
  ) {
    updateMovieDto.publishedYear = Number(updateMovieDto.publishedYear);
    if (!updateMovieDto) {
      throw new BadRequestException("Invalid data");
    }
    const { title, publishedYear } = updateMovieDto;
    const userId = req.user.sub;
    const movieData = {
      title,
      publishedYear,
      image: image?.filename,
      userId,
    };
    const movie = await this.movieService.updateById(id, movieData);
    if (movie) {
      await this.redisService.del(`movie:${id}`);
      await this.redisService.delByPattern(`movies_list:${userId}:*`);
      return {
        status: 200,
        message: "Movie details Updated",
        data: movie,
      };
    }
  }
}
