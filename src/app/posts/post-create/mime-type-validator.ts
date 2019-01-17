import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

// Explation of Return type:
// The following Arrow(=>) function can return either a Promise or a Observable.
// The Promise or Observable will be of object type.
// And the Object will be have a key of type string and value of any type.
// In Promise<{[key: string]: any}> or Observable<{[key: string]: any}> the [] is a  not array it is a syntax to tell that
// the object will have a key which will be of type string.
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(( observer: Observer<{[key: string]: any}> ) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array( <ArrayBuffer> fileReader.result) .subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      // This will check the mime type of the file.
      // If mime type is Jpeg or PNG then it is a valid mime type.
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true});
      }
      observer.complete();
    });
    // This will call the above loadend listner.
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;

};
