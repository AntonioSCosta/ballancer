
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  UserPlus,
  Share2,
  ListCheck,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const Help = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6 max-w-7xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {t("help.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("help.subtitle")}
        </p>
        <Separator className="my-4" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("help.sections.gettingStarted.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.gettingStarted.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.gettingStarted.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.gettingStarted.steps", { returnObjects: true }).map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {t("help.sections.playerManagement.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.playerManagement.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.playerManagement.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.playerManagement.features", { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("help.sections.teamGeneration.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.teamGeneration.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.teamGeneration.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.teamGeneration.features", { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListCheck className="h-5 w-5 text-primary" />
              {t("help.sections.matchResults.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.matchResults.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.matchResults.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.matchResults.features", { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              {t("help.sections.sharing.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.sharing.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.sharing.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.sharing.features", { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {t("help.sections.tips.title")}
            </CardTitle>
            <CardDescription>{t("help.sections.tips.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("help.sections.tips.description")}
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              {t("help.sections.tips.features", { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Help;
