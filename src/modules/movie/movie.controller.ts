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
  Logger,
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MulterInterceptor } from "../../common/interceptor/multer-interceptor";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateMovieDto } from "./dto/update-movie";
import { HttpExceptionFilter } from "src/filter/http-exception.filter";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Movie } from "./movie.schema";

@Controller("movies")
@ApiTags("movies")
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class MovieController {
  private readonly logger = new Logger(MovieController.name);

  constructor(private movieService: MovieService) {}
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
    console.log("image called");
    if (!createMovieDto || !image) {
      throw new BadRequestException("Invalid data");
    }

    const publishedYear = parseInt(
      createMovieDto.publishedYear as unknown as string,
      10
    );
    const { title } = createMovieDto;
    const userId = req.user.sub;
    const movieData = {
      title,
      publishedYear,
      image: image.filename,
      userId,
    };

    const movie = await this.movieService.createMovie(movieData);
    if (movie) {
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
        message: "Movie details",
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

    return this.movieService.findAll(pageNumber, limitNumber, userId);
  }
  @Get(":id")
  @ApiOperation({ summary: "Get movie by id" })
  @ApiResponse({
    schema: {
      example: {
        status: 200,
        message: "Movie details",
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
    return this.movieService.findById(id);
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
    if (!updateMovieDto) {
      throw new BadRequestException("Invalid data");
    }

    const publishedYear = parseInt(
      updateMovieDto.publishedYear as unknown as string,
      10
    );
    const { title } = updateMovieDto;
    const userId = req.user.sub;
    console.log(userId);
    const movieData = {
      title,
      publishedYear,
      image: image?.filename,
      userId,
    };
    const movie = await this.movieService.updateById(id, movieData);
    this.logger.debug("Logger initialization test");
    this.logger.log(movie, "Movie details Updated");
    console.log(movie, "movie");
    if (movie) {
      return {
        status: 200,
        message: "Movie details Updated",
        data: movie,
      };
    }
  }
}
