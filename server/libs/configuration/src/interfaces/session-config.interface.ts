export interface ISessionConfig {
  secret: string;
  cookie: {
    httpOnly: boolean;
    secure: boolean;
  };
}
