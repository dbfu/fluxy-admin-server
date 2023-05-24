import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  ALL,
  Put,
  Param,
  Del,
} from '@midwayjs/decorator';
import { BookDTO } from '../dto/book';
import { BookService } from '../service/book';

@Provide()
@Controller('/book')
export class BookController {
  @Inject()
  bookService: BookService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: BookDTO) {
    return await this.bookService.create(data);
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: BookDTO) {
    const book = await this.bookService.getById(data.id);
    // update
    book.name = data.name;
    return await this.bookService.edit(book);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: number) {
    const book = await this.bookService.getById(id);
    await this.bookService.remove(book);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: number) {
    return await this.bookService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(@Query('page') page: number, @Query('size') size: number) {
    return await this.bookService.page(page, size);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.bookService.list();
  }
}
