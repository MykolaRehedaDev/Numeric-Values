import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify } from 'aws-amplify';

import { AppModule } from './app/app.module';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);
platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));
