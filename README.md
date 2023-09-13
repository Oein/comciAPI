# comci-api

[컴시간학생.kr](http://컴시간학생.kr/)의 API를 쉽게 사용하기 위한 Typescript를 지원하는 Wrapper 입니다.

## 사용법

### 학교 검색

```ts
import { 학교검색 } from "comci-api";
학교검색("서울중").then(console.log);
/*
[
  { id: 66835, name: '남서울중학교' },
  { id: 62140, name: '북서울중학교' },
  { id: 44279, name: '서울중산고등학교' }
]
*/
```

### 학교 일과

```ts
import { 학교정보 } from "comci-api";
학교정보(66835).then(console.log);
```
