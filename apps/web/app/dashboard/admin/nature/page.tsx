 import  api from '@/lib/api';
 import  {signalementService} from '@/lib/services/signalement';
 import { Nature } from 'shared/enums';
  export default async  function  Signalement (){

   const signalement =  await signalementService.signalementByNature(Nature.AGGRESSION);
   console.log(signalement );

  }