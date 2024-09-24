import { AdminViewProps } from "payload";

const AfterNavLinks = (props:AdminViewProps) => {
  return (
    <ul>
      <li>
        <a href="/admin/chat/">Chat</a>
      </li>
      <li>
        <a href="/admin/history">History</a>
      </li>
    </ul>
  )
}

export default AfterNavLinks
