import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MulterInterceptor } from '../../common/interceptor/multer-interceptor';
import { UpdateMovieDto } from './dto/update-movie';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseInterceptors(MulterInterceptor)
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!createMovieDto || !image) {
      throw new Error('Invalid data');
    }
    const publishedYear = parseInt(
      createMovieDto.publishedYear as unknown as string,
      10,
    );
    const { title } = createMovieDto;
    const movieData = {
      title,
      publishedYear,
      image: image.filename, // Save the path of the uploaded image
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
  async findById(@Body() id: string) {
    return this.movieService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(MulterInterceptor)
  async updateById(
    @Body() updateMovieDto: UpdateMovieDto,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!updateMovieDto || !image) {
      throw new Error('Invalid data');
    }
    const publishedYear = parseInt(
      updateMovieDto.publishedYear as unknown as string,
      10,
    );
    const { title } = updateMovieDto;
    const movieData = {
      title,
      publishedYear,
      image: image.filename, // Save the path of the uploaded image
    };

    return this.movieService.updateById(id, movieData);
  }
}
