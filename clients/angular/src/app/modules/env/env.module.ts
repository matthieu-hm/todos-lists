import {
  ModuleWithProviders, NgModule, Optional, SkipSelf,
} from '@angular/core';
import { IEnvironment } from './interfaces';
import { Environment } from './models';

@NgModule({
  imports: [],
})
export class EnvModule {
  public static forRoot(environmentData: IEnvironment): ModuleWithProviders<EnvModule> {
    const environment = new Environment(environmentData);

    return {
      ngModule: EnvModule,
      providers: [
        { provide: Environment, useValue: environment },
      ],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: EnvModule | null,
  ) {
    this.throwIfAlreadyLoaded(parentModule);
  }

  private throwIfAlreadyLoaded(parentModule?: EnvModule | null) {
    if (parentModule) {
      throw new Error('EnvModule has already been loaded. Import EnvModules in the AppModule only.');
    }
  }
}
