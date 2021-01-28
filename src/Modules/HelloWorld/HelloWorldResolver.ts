// src/Modules/HelloWorld/HelloWorldResolver.ts
import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';

@Service()
@Resolver()
export class HelloWorldResolver {
  @Query(() => String, {
    description: 'Returns a plain "helloWorld"',
  })
  public helloWorld(): 'helloWorld' {
    logger.log(LogMode.DEBUG, 'HelloWorldQuery');

    return 'helloWorld';
  }
}
