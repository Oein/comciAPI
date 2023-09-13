import axios from "axios";
import { transfrom2Comci } from "./transform2comci";
import { writeFileSync } from "fs";

export interface 교과목 {
  교과명: string;
  교사명: string;
}

export async function 학교검색(name: string) {
  const { data } = await axios.get(
    "http://comci.kr:4082/36179?17384l" + transfrom2Comci(name)
  );
  const rp = data.trim().replace(`{"학교검색":`, "") as string;
  const res = rp.slice(0, rp.lastIndexOf("}"));
  const json = JSON.parse(res).map((x: (string | number)[]) => {
    return {
      id: x[3] as number,
      name: x[2] as string,
    };
  });
  return json;
}

export async function 학교정보(id: number) {
  const url = "http://comci.kr:4082/36179?" + btoa("73629_" + id + "_0_1");
  const { data } = await axios.get(url);
  const jsoned = JSON.parse(data.trim().slice(0, data.lastIndexOf("}") + 1));
  const { 자료147, 자료481, 자료492, 자료446, 자료244 } = jsoned;
  const 교시_데이터1: (number | (number | number[])[])[] = 자료481;
  const 교시_데이터2: (number | (number | number[])[])[] = 자료147;
  const 학년개수 = 교시_데이터1[0] as number;

  const 과목 = 자료492 as (string | number)[];
  const 교사 = 자료446 as string[];

  const 학년별_교시_데이터: 교과목[][][][] = [];

  for (let 학년 = 0; 학년 < 학년개수; 학년++) {
    // 학년 추가
    const 학년_교시_데이터: 교과목[][][] = [];
    const 반_데이터 = 교시_데이터1[학년 + 1] as (number | number[])[];
    const 반_개수 = 반_데이터[0] as number;

    for (let 반 = 0; 반 < 반_개수; 반++) {
      const 반_교시_데이터 = 반_데이터[반 + 1] as (number | number[])[];
      const 반_교시_데이터2 = (교시_데이터2[학년 + 1] as number[][])[
        반 + 1
      ] as (number | number[])[];
      const 날짜_개수 = 반_교시_데이터[0] as number;

      const 반_시간표: 교과목[][] = [];

      for (let 날짜 = 0; 날짜 < 날짜_개수; 날짜++) {
        const 날짜_데이터 = 반_교시_데이터[날짜 + 1] as number[];
        const 날짜_데이터2 = 반_교시_데이터2[날짜 + 1] as number[];
        const 교시_수 = 날짜_데이터[0];

        const 오늘_시간표: 교과목[] = [];

        for (let 교시 = 0; 교시 < 교시_수; 교시++) {
          const 원자료 = 날짜_데이터[교시 + 1] as number;
          const 일일자료 = 날짜_데이터2[교시 + 1] as number;

          const th = Math.floor(일일자료 / 100);
          const sb = 일일자료 - th * 100;

          오늘_시간표.push({
            교과명: 과목[sb] as string,
            교사명: 교사[th] as string,
          });
        }

        반_시간표.push(오늘_시간표);
      }

      학년_교시_데이터.push(반_시간표);
    }
    학년별_교시_데이터.push(학년_교시_데이터);
  }

  const 마지막_수정일_문자열 = 자료244 as string;
  const 마지막_수정_날짜 = 마지막_수정일_문자열
    .split(" ")[0]
    .split("-")
    .map(parseInt);
  const 마지막_수정_시간 = 마지막_수정일_문자열
    .split(" ")[1]
    .split(":")
    .map(parseInt);
  const 마지막_수정일 = new Date(
    마지막_수정_날짜[0],
    마지막_수정_날짜[1] - 1,
    마지막_수정_날짜[2],
    마지막_수정_시간[0],
    마지막_수정_시간[1],
    마지막_수정_시간[2]
  );

  const nData = {
    교사: 자료446.slice(1) as string[],
    교시: 학년별_교시_데이터,
    마지막_수정일: 마지막_수정일,
  };
  return nData;
}
