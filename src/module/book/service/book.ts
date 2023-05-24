import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { BookEntity } from '../entity/book';

@Provide()
export class BookService extends BaseService<BookEntity> {
  @InjectEntityModel(BookEntity)
  bookModel: Repository<BookEntity>;

  getModel(): Repository<BookEntity> {
    return this.bookModel;
  }
}
