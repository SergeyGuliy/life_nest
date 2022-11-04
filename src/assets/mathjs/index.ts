import { create, all } from 'mathjs';

import { customFunctions } from '@assets/mathjs/custom-functions';

const mathjs = create(all);
mathjs.import(customFunctions);

export { mathjs };
