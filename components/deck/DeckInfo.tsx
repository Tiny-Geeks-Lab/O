import Colors from "@/constants/Colors";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import Loader from "@/modules/Loader";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { SvgXml } from "react-native-svg";

interface DeckInfoProps {
  title: string | undefined;
  id: string | number;
  imageId: string;
  handleOpenDeckInfo: () => void;
}

const DeckInfo: React.FC<DeckInfoProps> = ({ title, id, imageId, handleOpenDeckInfo }) => {
  const { t } = useTranslation();
  const { svgData, isLoadingImage, error: errorSvg } = useFetchDeckSvg(imageId);
  return (
    <View style={styles.commonInformaion}>
      {isLoadingImage ? (
        <ContentLoader
          speed={2}
          width="100%"
          height={200}
          backgroundColor="#d1d1d1"
          foregroundColor="#c0c0c0"
          style={styles.skeletonContainer}
        >
          <Circle cx="50%" cy="70" r="40" />
          <Rect x="20%" y="120" rx="5" ry="5" width="60%" height="20" />
          <Rect x="37%" y="155" rx="18" ry="24.5" width="25%" height="32" />
        </ContentLoader>
      ) : (
        <View style={{ position: "absolute", bottom: 95 }}>
          <SvgXml xml={svgData} width={83} height={70} />
        </View>
      )}

      {!isLoadingImage && (
        <>
          <View style={{ width: "100%", position: "absolute", bottom: 52 }}>
            <Text numberOfLines={1} style={styles.text}>
              {title?.toLowerCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleOpenDeckInfo}>
            <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>{t("play")}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commonInformaion: {
    flex: 1,
    zIndex: 100,
    height: "100%",

    flexDirection: "column",
    justifyContent: "center",

    alignItems: "center",
  },
  text: {
    bottom: 0,
    textAlign: "center",
    color: Colors.deepGray,
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 86,
    backgroundColor: Colors.deepBlue,
    borderRadius: 24.5,
    bottom: 0,
  },
  skeletonContainer: {
    width: "100%",
  },
});

export default DeckInfo;
