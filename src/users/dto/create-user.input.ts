import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'user first name' })
  firstName: string;
  @Field(() => String, { description: 'user last name' })
  lastName: string;
  @Field(() => String, { description: 'user email' })
  email: string;
}
