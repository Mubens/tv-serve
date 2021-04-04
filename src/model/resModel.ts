class BaseModel {
  data: any = null;
  message: string;

  constructor(data: any, message?: string) {
    if (typeof data === 'string') {
      this.message = data;
      data = message = null;
    }

    if (data) {
      this.data = data;
    }

    if (message) {
      this.message = this.message;
    }
  }
}

class SuccessModel extends BaseModel {
  errno: number;

  constructor(data: any, message?: string) {
    super(data, message);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  errno: number;

  constructor(data: any, message?: string) {
    super(data, message);
    this.errno = 1;
  }
}

export { SuccessModel, ErrorModel };
