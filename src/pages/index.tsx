import Head from "next/head";
import { FormEvent, useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [htmlCode, setHtmlCode] = useState(basicCode);
  const [result, setResult] = useState("");
  const [instruction, setInstruction] = useState("");

  async function onSubmit(htmlCode: string, instruction: string) {
    try {
      const response = await fetch("/api/gen_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlCode, instruction }),
      });

      const data = await response.json();
      if (response.status != 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Jarvis</title>
      </Head>

      <main className='p-4 flex flex-col items-start'>
        <div>HTML 코드</div>
        <Editor
          height='70vh'
          defaultLanguage='html'
          onChange={(code) => setHtmlCode(code || "")}
          value={htmlCode}
        />
        <div>명령</div>
        <input
          type='text'
          className='w-full mb-2'
          onChange={(e) => setInstruction(e.target.value)}
        ></input>
        <button
          className='font-bold py-2 px-4 rounded bg-blue-500 text-white'
          onClick={async () => await onSubmit(htmlCode, instruction)}
        >
          연관 id 찾기
        </button>
        <div className='mt-4'>{result}</div>
      </main>
    </div>
  );
}

const basicCode = `<div id="0">
  <button id="1">이상욱 님</button>
  <button id="2">이용내역</button>
  <button id="3">즐겨찾기</button>
</div>
<div id="4">
  <button id="5">쿠폰 0개</button>
  <button id="6">GO마일리지 0M</button>
</div>
<div id="7">
  <button id="8">고속∙시외버스 막힘없이 달린다</button>
  <button id="9">온다택시 오늘도 안전하게</button>
  <button id="10">공항버스예매 공항까지 편하게</button>
  <button id="11">버스정보 집앞까지 정확하게</button>
  <button id="12">따릉이 나의 운동 메이트</button>
  <button id="13">지하철노선 빠르고 정확하게</button>
  <button id="14">씽씽 언제 어디서나</button>
</div>
<div id="15">
  <button id="15">홈</button>
  <button id="16">마이</button>
  <button id="17">혜택</button>
  <button id="18">더보기</button>
</div>`;
