import { FileEntity } from '../entity/file';
import { PickVO } from '../../../utils/vo.utils';

// eslint-disable-next-line prettier/prettier
export class FileVO extends PickVO(FileEntity, []) {}
