import {Amplify} from 'aws-amplify';
import awsconfig from '../aws-exports';

// Amplify.configure({
//   ...awsconfig,
//   storage: AsyncStorage,
// });

Amplify.configure(awsconfig);

export default Amplify;
