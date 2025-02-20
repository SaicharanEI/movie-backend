import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Movie } from "../../modules/movie/movie.schema";
import { CreateMovieDto, CreateMovieSchema } from "./dto/create-movie.dto";
import { UpdateMovieSchema } from "./dto/update-movie";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: mongoose.Model<Movie>
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const parsed = CreateMovieSchema.safeParse(createMovieDto);
    if (!parsed.success) {
      throw new BadRequestException("Invalid data");
    }
    const { title, publishedYear, image, userId } = parsed.data;

    const movieUpdateData: Partial<Movie> = { title, publishedYear, userId };

    if (image) {
      movieUpdateData.image = image;
    }
    const newMovie = new this.movieModel(movieUpdateData);

    return await newMovie.save();
  }

  async findAll(
    page: number,
    limit: number,
    userId: string
  ): Promise<{ data: Movie[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.movieModel
        .find({ userId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments({ userId: userId }).exec(),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException("Movie not found.");
    }
    return movie;
  }

  async updateById(id: string, updateMovieDto: CreateMovieDto): Promise<Movie> {
    const parsed = UpdateMovieSchema.safeParse(updateMovieDto);
    if (!parsed.success) {
      throw new BadRequestException("Invalid data");
    }

    const { title, publishedYear, image } = parsed.data;

    const movieUpdateData: Partial<Movie> = { title, publishedYear };

    if (image) {
      movieUpdateData.image = image;
    }

    const movie = await this.movieModel
      .findByIdAndUpdate(id, movieUpdateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!movie) {
      throw new NotFoundException("Movie not found.");
    }

    return movie;
  }
}
