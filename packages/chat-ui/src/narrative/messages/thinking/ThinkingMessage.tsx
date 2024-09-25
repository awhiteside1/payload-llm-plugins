import { View, Text } from "reshaped";
import "./styles.css";

const DotsLoader = () => <div className="dots"></div>;

interface ThinkingState {
  activity?: string;
}

export const ThinkingMessage = ({ activity }: ThinkingState) => {
  return (
    <View direction="column" align="center" gap={4}>
      <DotsLoader />
    </View>
  );
};
