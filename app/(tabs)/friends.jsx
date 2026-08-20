import { ScrollView } from "react-native";
import {
  Avatar,
  Chip,
  EmptyState,
  Icon,
  ListGroup,
  ListRow,
  NavBar,
  Screen,
  useColors,
} from "@/components/ui";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function FriendsScreen() {
  const { friends } = useAuthContext();
  const colors = useColors();

  const hasFriends = friends?.length > 0;

  return (
    <Screen>
      <NavBar title="Freunde" />

      {hasFriends ? (
        <ScrollView contentContainerClassName="px-4 pb-8">
          <ListGroup
            header={`${friends.length} ${friends.length === 1 ? "Person" : "Personen"}`}
          >
            {friends.map((f, index) => (
              <ListRow
                key={f.id}
                title={f.display_name || f.username}
                subtitle={`@${f.username}`}
                leading={<Avatar name={f.display_name || f.username} />}
                showSeparator={index < friends.length - 1}
                trailing={
                  f.streak > 0 ? (
                    <Chip tone="accent" label={String(f.streak)} icon="flame" />
                  ) : null
                }
              />
            ))}
          </ListGroup>
        </ScrollView>
      ) : (
        <EmptyState
          icon={<Icon name="personAdd" size={40} color={colors.muted} />}
          title="Noch niemand dabei"
          description="Such deine Freunde ueber die Lupe im Feed."
        />
      )}
    </Screen>
  );
}
