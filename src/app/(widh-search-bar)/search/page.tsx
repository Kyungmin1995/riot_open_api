import SearchBar from "./../component/searchBar";
import styles from "./page.module.css";

interface Participant {
  riotIdGameName: string; //닉네임
  placement: number; //순위
  gold_left: number; //남은골드
  level: number; //레벨
  players_eliminated: number; //처형수
  traits?: [
    {
      name: string; //특성 이름
      num_units: number; //특성 수
      style: number;
      tier_current: number; //현재 달성한 티어(효과 수준)입니다.
      tier_total: number; //해당 특성의 최대 티어입니다.
    }
  ];
  units: [
    {
      character_id: string; //챔프이름
      itemNames: string[]; //아이템
      name: string;
      rarity: number; //몇 코스트
      tier: number; //별 성
    }
  ];
  // 다른 속성들도 필요한 대로 추가합니다.
}
interface MatchInfo {
  info: {
    participants: Participant[];
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function GetPuuid({ nickname }: { nickname: any }) {
  if (nickname === null) return <></>;
  if (nickname === undefined)
    return (
      <>
        &nbsp;
        <div>유저명을 검새해주세요</div>
      </>
    );

  const headers = {
    "X-Riot-Token": "RGAPI-fd87e30b-d1ed-4ac7-83c0-4998bf1b66c6",
  };

  const userNickname = nickname.split(" ")[0];
  const tagLine = nickname.split(" ")[1];
  const encodedName = encodeURI(userNickname);

  const response = await fetch(
    `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedName}/${tagLine}`,
    { method: "GET", headers }
  );

  const puuidData = await response.json();
  const puuid = puuidData.puuid;

  // 2단계: puuid를 사용하여 matchData를 먼저 가져온 후, Promise.all로 요청 묶음
  const matchData: string[] = await fetch(
    `https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20`,
    { method: "GET", headers }
  ).then((response) => response.json());

  // 3단계: matchData의 첫 번째 매치 ID를 사용하여 Promise.all로 추가 요청 묶기
  const [matchInfo]: MatchInfo[] = await Promise.all([
    fetch(
      `https://asia.api.riotgames.com/tft/match/v1/matches/${matchData[0]}`,
      { method: "GET", headers }
    )
      .then((response) => response.json())
      .catch((err) => {
        return <div>오류가 발생했습니다 ,,,</div>;
      }),
  ]);

  // if (!response.ok) return <div>오류가 발생했습니다 ,,,</div>;
  if (!matchInfo.info)
    return <div>존재하지 않는 닉네임 입니다 태그를 확인해주세요</div>;
  if (!matchInfo.info.participants) return <div>오류가 발생했습니다 ,,,</div>;
  return (
    <div>
      <div
        style={{
          background: "#ddd",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-around",
          gap: 10,

          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
          borderBottom: "1px solid #000",
        }}
      >
        <div style={{ width: "5%" }}>순위</div>
        <div style={{ width: "15%" }}>닉네임</div>
        <div style={{ width: "10%" }}>남은골드</div>
        <div style={{ width: "10%" }}>레벨</div>
        <div style={{ width: "10%" }}>처형 수</div>
        <div style={{ width: "50%" }}>유닛</div>
      </div>
      {matchInfo.info.participants.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: "#ddd",
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-around",
            gap: 10,
            alignItems: "center",
            alignContent: "center",
            textAlign: "center",
            borderBottom: "1px solid #000",
          }}
        >
          <div style={{ width: "5%" }}>{item.placement}</div>
          <div style={{ width: "15%" }}>{item.riotIdGameName}</div>
          <div style={{ width: "10%" }}>{item.gold_left}</div>
          <div style={{ width: "10%" }}>{item.level}</div>
          <div style={{ width: "10%" }}>{item.players_eliminated}</div>
          <div
            style={{
              width: "50%",
              maxHeight: 150,
              borderBottom: "1px solid#000d",
              flexWrap: "wrap",
              display: "flex",
              boxSizing: "border-box",
            }}
          >
            {item.units.map((_, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundSize: "cover",
                      backgroundImage: `url(https://opgg-static.akamaized.net/meta/images/lol/latest/champion/${_.character_id.replace(
                        "TFT12_",
                        ""
                      )}.png)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    nickname?: string;
  }>;
}) {
  const { nickname } = await searchParams;

  return (
    <div className={styles.page}>
      <SearchBar />
      <GetPuuid nickname={nickname} />
    </div>
  );
}
