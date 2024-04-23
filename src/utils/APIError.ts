// @desc this class is to handle operational errors (error that can be predicated)
export class APIError extends Error {
     status:string
    constructor(public message:string, public statusCode?:number) {
      super(message);
      this.statusCode = statusCode || 400;
      this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    }
}
  