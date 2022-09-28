import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MultipartUploadToFilePath = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.filepath;
  },
);