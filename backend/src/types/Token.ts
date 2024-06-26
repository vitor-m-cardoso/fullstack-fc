type Token = {
  token: string
};

type TokenPayload = {
  id: number;
  email: string;
  role: string;
};

export default Token;
export { TokenPayload };
