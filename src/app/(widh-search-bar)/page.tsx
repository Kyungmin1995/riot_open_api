import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        background: "blue",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#ddd",
          width: 200,
          textAlign: "center",
          height: 40,
          alignContent: "center",
          borderRadius: 5,
          border: "1px solid #000",
        }}
      >
        <Link
          href={"/search"}
          style={{ textDecoration: "none", color: "#000" }}
        >
          사용자 검색
        </Link>
      </div>
    </div>
  );
}
