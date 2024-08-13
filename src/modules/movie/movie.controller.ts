// src/movie/movie.controller.ts
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
  Request, // Import Request decorator
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MulterInterceptor } from '../../common/interceptor/multer-interceptor';
// import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMovieDto } from './dto/update-movie';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseInterceptors(MulterInterceptor)
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ) {
    if (!createMovieDto || !image) {
      throw new Error('Invalid data');
    }

    const publishedYear = parseInt(
      createMovieDto.publishedYear as unknown as string,
      10,
    );
    const { title } = createMovieDto;
    const userId = req.user.sub; // Access the user ID from the request object
    console.log(userId);
    const movieData = {
      title,
      publishedYear,
      image: image.filename, // Save the path of the uploaded image
      userId, // Include userId in movie data
    };
    return this.movieService.createMovie(movieData);
  }

  @Get()
  @UseInterceptors(MulterInterceptor)
  async findAll() {
    return this.movieService.findAll();
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
      throw new Error('Invalid data');
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
    return this.movieService.updateById(id, movieData);
  }
}
