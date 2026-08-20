import { Image } from "expo-image";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  EmptyState,
  Glass,
  Icon,
  ListGroup,
  ListRow,
  NavBar,
  Screen,
  Text,
  TextField,
  useColors,
  useScheme,
  type ColorName,
  type TextVariant,
} from "@/components/ui";
import { friends, posts } from "@/lib/design/mock";
import { fontSize, palette } from "@/lib/design/tokens";

// Der Katalog: alles was das Design kann, auf einem Screen.
// Aendert sich ein Token, siehst du hier sofort was es anfasst.

const TYPE_SCALE: TextVariant[] = [
  "largeTitle",
  "title1",
  "title2",
  "title3",
  "headline",
  "body",
  "subhead",
  "footnote",
  "caption",
];

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-3 px-4 pb-10">
      <View>
        <Text variant="title3">{title}</Text>
        {hint ? (
          <Text variant="footnote" tone="muted">
            {hint}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export default function DesignGallery() {
  const colors = useColors();
  const scheme = useScheme();

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-16">
        <NavBar
          title="Katalog"
          subtitle={`Burnchat — aktiv: ${scheme === "dark" ? "dunkel" : "hell"}`}
        />

        <Section
          title="Farben"
          hint="Beide Saetze nebeneinander. Der Modus folgt der Systemeinstellung."
        >
          <View className="flex-row gap-2 px-1 pb-1">
            <Text variant="caption" tone="faint" className="w-24">
              Name
            </Text>
            <Text variant="caption" tone="faint">
              hell / dunkel
            </Text>
          </View>

          {(Object.keys(palette.light) as ColorName[]).map((name) => (
            <View key={name} className="flex-row items-center gap-3">
              <Text variant="subhead" className="w-24">
                {name}
              </Text>
              <View
                style={{ backgroundColor: `rgb(${palette.light[name]})` }}
                className="size-10 rounded-md border border-separator"
              />
              <View
                style={{ backgroundColor: `rgb(${palette.dark[name]})` }}
                className="size-10 rounded-md border border-separator"
              />
            </View>
          ))}
        </Section>

        <Section
          title="Schrift"
          hint="Apples Stufen. Skaliert mit der Systemschriftgroesse."
        >
          {TYPE_SCALE.map((variant) => (
            <View
              key={variant}
              className="flex-row items-baseline justify-between gap-4 border-b border-separator pb-2"
            >
              <Text variant={variant} className="flex-1" numberOfLines={1}>
                {variant}
              </Text>
              <Text variant="caption" tone="faint">
                {fontSize[variant][0]} / {fontSize[variant][1]}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Buttons" hint="Alle 44pt hoch, Kapselform, scale(0.97)">
          <Button title="Konto erstellen" onPress={() => {}} />
          <Button
            title="Freund hinzufuegen"
            variant="secondary"
            onPress={() => {}}
          />
          <Button title="Abmelden" variant="ghost" onPress={() => {}} />
          <Button title="Oops" variant="destructive" onPress={() => {}} />
          <Button title="Gesperrt" disabled onPress={() => {}} />
          <Button
            title="Mit Symbol"
            variant="secondary"
            icon={<Icon name="add" size={18} color={colors["accent-strong"]} />}
            onPress={() => {}}
          />
        </Section>

        <Section
          title="Pillen"
          hint="Gefuellt statt farbige Schrift — nur so reicht der Kontrast."
        >
          <View className="flex-row flex-wrap gap-2">
            <Chip tone="accent" label="12" icon="flame" />
            <Chip tone="sage" label="Freund" icon="check" />
            <Chip tone="ice" label="Neu" />
            <Chip tone="rose" label="Verbrannt" />
            <Chip tone="quiet" label="Ohne Aussage" />
          </View>
        </Section>

        <Section
          title="Eingabefelder"
          hint="Zeile in einer Gruppe fuer Formulare, gefuellt fuer die Suche."
        >
          <ListGroup footer="Deine Freunde finden dich ueber den Nutzernamen.">
            <TextField
              placeholder="Nutzername"
              autoCapitalize="none"
              showSeparator
            />
            <TextField placeholder="Anzeigename" autoCapitalize="words" />
          </ListGroup>

          <TextField variant="filled" placeholder="Suchen" className="mt-2" />
        </Section>

        <Section title="Karte" hint="aussen 24, Innenabstand 16, Bild 8">
          <Card>
            <Image
              source={{ uri: posts[0].imageUrl }}
              style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 8 }}
              contentFit="cover"
            />
            <View className="mt-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Avatar name="Julian" size={28} />
                <Text variant="headline">@julian</Text>
              </View>
              <Chip tone="accent" label="12" icon="flame" />
            </View>
          </Card>
        </Section>

        <Section
          title="Gruppierte Liste"
          hint="Weisse Zeilen, Radius 12, kein Schatten — Apples Listenstil."
        >
          <ListGroup header="Freunde">
            {friends.map((friend, index) => (
              <ListRow
                key={friend.id}
                title={friend.displayName}
                subtitle={`@${friend.username}`}
                leading={<Avatar name={friend.displayName} />}
                showSeparator={index < friends.length - 1}
                trailing={
                  friend.streak > 0 ? (
                    <Chip
                      tone="accent"
                      label={String(friend.streak)}
                      icon="flame"
                    />
                  ) : null
                }
                onPress={() => {}}
              />
            ))}
          </ListGroup>
        </Section>

        <Section title="Glas" hint="Leiste ueber Inhalt, nie deckend">
          <View className="h-40 overflow-hidden rounded-2xl">
            <Image
              source={{ uri: posts[1].imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <Glass tint="dark" className="absolute bottom-0 left-0 right-0 p-4">
              <Text variant="headline" tone="inverse">
                @lena
              </Text>
              <Text variant="footnote" tone="inverse">
                vor 14 Minuten
              </Text>
            </Glass>
          </View>
        </Section>

        <Section title="Leerzustand">
          <View className="h-64 rounded-2xl bg-surface">
            <EmptyState
              icon={<Icon name="flame" size={40} color={colors.accent} />}
              title="Alles gesehen"
              description="Neue Bilder deiner Freunde landen sofort hier."
              actionTitle="Foto machen"
              onAction={() => {}}
            />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}
