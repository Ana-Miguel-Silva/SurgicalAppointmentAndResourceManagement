import { HttpInterceptorFn } from '@angular/common/http';
import { debug } from 'console';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
  const tokenReq = localStorage.getItem('token');
  const clonedReq = req.clone({
    setHeaders:{
      Authorization: '${tokenReq}'
    }
  })

  return next(clonedReq);
};
