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
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MulterInterceptor } from '../../common/interceptor/multer-interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMovieDto } from './dto/update-movie';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

@Controller('movies')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post()
  @UseInterceptors(MulterInterceptor)
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ) {
    console.log('image called');
    if (!createMovieDto || !image) {
      throw new BadRequestException('Invalid data');
    }

    const publishedYear = parseInt(
      createMovieDto.publishedYear as unknown as string,
      10,
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
        statusCode: 201,
        message: 'Movie successfully created',
        data: movie,
      };
    }
  }

  @Get()
  @UseInterceptors(MulterInterceptor)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '8',
    @Request() req,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const userId = req.user.sub;

    return this.movieService.findAll(pageNumber, limitNumber, userId);
  }
  @Get(':id')
  @UseInterceptors(MulterInterceptor)
  async findById(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(MulterInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req, // Access the request object
  ) {
    if (!updateMovieDto || !image) {
      throw new BadRequestException('Invalid data');
    }

    const publishedYear = parseInt(
      updateMovieDto.publishedYear as unknown as string,
      10,
    );
    const { title } = updateMovieDto;
    const userId = req.user.sub; // Access the user ID from the request object
    console.log(userId);
    const movieData = {
      title,
      publishedYear,
      image: image.filename, // Save the path of the uploaded image
      userId, // Include userId in movie data
    };
    const movie = this.movieService.updateById(id, movieData);
    if (movie) {
      return {
        statusCode: 200,
        message: 'Movie details Updated',
        data: movie,
      };
    }
  }
}
