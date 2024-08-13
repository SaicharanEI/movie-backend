import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Movie } from '../../modules/movie/movie.schema';
import { CreateMovieDto, CreateMovieSchema } from './dto/create-movie.dto'; // Adjust the path to match your project structure

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: mongoose.Model<Movie>,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    // Validate the DTO using Zod schema
    const parsed = CreateMovieSchema.safeParse(createMovieDto);
    if (!parsed.success) {
      throw new BadRequestException('Invalid data');
    }

    const { title, publishedYear, image, userId } = parsed.data;
    console.log(title, publishedYear, image, userId);
    try {
      // Create and save the movie using Mongoose model
      const newMovie = new this.movieModel({
        title,
        publishedYear,
        image: image,
        userId,
      });

      return await newMovie.save();
    } catch (error) {
      throw new Error('Error saving movie');
    }
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieModel.find().exec();
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found.');
    }
    return movie;
  }

  async updateById(id: string, updateMovieDto: CreateMovieDto): Promise<Movie> {
    // Validate the DTO using Zod schema
    const parsed = CreateMovieSchema.safeParse(updateMovieDto);
    if (!parsed.success) {
      throw new BadRequestException('Invalid data');
    }

    const { title, publishedYear, image } = parsed.data;

    const movie = await this.movieModel
      .findByIdAndUpdate(
        id,
        { title, publishedYear, image },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!movie) {
      throw new NotFoundException('Movie not found.');
    }

    return movie;
  }

  async deleteById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndDelete(id).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found.');
    }
    return movie;
  }
}
