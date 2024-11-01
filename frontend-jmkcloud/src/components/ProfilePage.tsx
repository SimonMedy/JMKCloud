import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
}

interface SubscriptionData {
  plan: string;
  price: number;
  nextBillingDate: string;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserData({
        name: "John Doe",
        email: "john.doe@example.com",
        avatarUrl: "https://github.com/shadcn.png",
      });
      setSubscriptionData({
        plan: "Pro",
        price: 9.99,
        nextBillingDate: "2024-05-01",
      });
    };

    fetchUserData();
  }, []);

  const handleDeleteProfile = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profil supprimé");
    navigate("/");
  };

  const handleAccessStorage = () => {
    console.log("Accès à l'espace de stockage");
  };

  const handleCancelSubscription = () => {
    console.log("Abonnement résilié");
  };

  if (!userData || !subscriptionData) {
    return <div>Chargement...</div>;
  }

  const PersonalInfo = () => (
    <>
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
          <AvatarFallback>
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{userData.name}</h2>
        <p className="text-gray-500">{userData.email}</p>
      </div>

      <div className="space-y-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleAccessStorage}
        >
          Accéder à mon espace de stockage
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" variant="destructive">
              Supprimer mon profil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera
                définitivement votre compte et supprimera vos données de nos
                serveurs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProfile}>
                Continuer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );

  const SubscriptionInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations d'abonnement</h3>
      <p>Plan actuel : {subscriptionData.plan}</p>
      <p>Prix : {subscriptionData.price}€ / mois</p>
      <p>Prochaine facturation : {subscriptionData.nextBillingDate}</p>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => console.log("Voir les factures")}
      >
        Voir mes factures
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="destructive">
            Résilier mon abonnement
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la résiliation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir résilier votre abonnement ? Vous perdrez
              l'accès à tous les services premium à la fin de votre période de
              facturation actuelle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription}>
              Confirmer la résiliation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Profil Utilisateur
          </CardTitle>
          <div className="flex items-center space-x-2 justify-center mt-4">
            <Label htmlFor="info-switch">Informations personnelles</Label>
            <Switch
              id="info-switch"
              checked={showSubscription}
              onCheckedChange={setShowSubscription}
            />
            <Label htmlFor="info-switch">Informations d'abonnement</Label>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showSubscription ? <SubscriptionInfo /> : <PersonalInfo />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
