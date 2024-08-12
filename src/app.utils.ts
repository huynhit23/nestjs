import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_RULE = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/';

const PASSWORD_RULE_MESSAGE =
  'Mật khẩu có 8 kí tự,1 chữ hoa, 1 chữ thường, 1 số và 1 kí tự đặc biệt';

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
};

export const SETTINGS = {
  VALIDATION_PIPE,
};
