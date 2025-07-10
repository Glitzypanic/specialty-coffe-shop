// types/global.d.ts
import mongoose from 'mongoose';

declare module 'global' {
  interface Global {
    mongoose: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }
}
