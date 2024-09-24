import { Role, Speaker } from "./type";
import { Avatar } from "reshaped";
import { match } from "ts-pattern";
import { draw, list } from "radash";
import { Message } from "./Message";
import Chance from "chance";
import feather from "feather-icons";

const givenASpeaker = (role: Role = "user"): Speaker => {
  const initials = match(role)
    .with("user", () => "AW")
    .with("assistant", () => "GPT")
    .with("member", () => "SS")
    .otherwise(() => "?");

  return {
    avatar: (
      <Avatar
        size={10}
        color={draw(["primary", "neutral", "positive"])}
        initials={initials}
      />
    ),
    role: role,
  };
};

export const givenSomeMessages = (count = 5) => {
  const chance = new Chance();
  const assistant = givenASpeaker("assistant");
  const user = givenASpeaker("user");

  return (
    <>
      {list(0, count, (i) => (
        <Message key={i} speaker={chance.pickone([assistant, user])}>
          <p>{chance.sentence()}</p>
        </Message>
      ))}
    </>
  );
};

export const givenAnIceBreaker = () => {
  const chance = new Chance();
  return {
    title: chance.sentence({ words: 4 }),
    subtitle: chance.sentence({ words: 8 }),
    icon: (
      <FeatherIcon icon={draw(["speaker", "coffee", "anchor", "server"])} />
    ),
  };
};

export const FeatherIcon = ({ icon }: { icon: keyof typeof feather.icons }) => {
  const data = feather.icons[icon];
  return (
    <svg
      {...data.attrs}
      dangerouslySetInnerHTML={{ __html: data.contents }}
    ></svg>
  );
};
