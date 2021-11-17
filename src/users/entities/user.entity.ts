import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class User extends Document {
  @Prop({ type: mongooseSchema.Types.ObjectId, required: true, auto: true, index: true })
  @Field(() => String, { description: 'user id' })
  _id: string;
  @Prop({ type: mongooseSchema.Types.String, required: true })
  @Field(() => String, { description: 'user first name' })
  firstName: string;
  @Prop({ type: mongooseSchema.Types.String, required: true })
  @Field(() => String, { description: 'user last name' })
  lastName: string;
  @Prop({ type: mongooseSchema.Types.String, required: true })
  @Field(() => String, { description: 'user email' })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
