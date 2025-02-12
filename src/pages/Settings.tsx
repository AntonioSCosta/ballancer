
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
    toast.success("Language updated successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6 max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {t("settings.title")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={i18n.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("settings.languages.en")}</SelectItem>
              <SelectItem value="pt-PT">{t("settings.languages.pt-PT")}</SelectItem>
              <SelectItem value="pt-BR">{t("settings.languages.pt-BR")}</SelectItem>
              <SelectItem value="fr">{t("settings.languages.fr")}</SelectItem>
              <SelectItem value="es">{t("settings.languages.es")}</SelectItem>
              <SelectItem value="it">{t("settings.languages.it")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Settings;
