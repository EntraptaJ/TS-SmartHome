// src/Modules/HelloWorld/HelloWorldResolver.ts
import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Service()
@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  public helloWorld(): 'helloWorld' {
    return 'helloWorld';
  }
}
