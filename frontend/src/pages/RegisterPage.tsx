import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/layout/TopBar";

interface FormData {
  email: string;
  username: string;
  password: string;
}

export default function RegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData.email, formData.username, formData.password);
      setRegisteredEmail(formData.email);
      setShowConfirmDialog(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setError("");
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await register(formData.email, formData.username, formData.password);
      toast({
        title: "Email renvoyé !",
        description: "Un nouvel email de confirmation vous a été envoyé.",
        className: "text-left",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de renvoyer l'email de confirmation.",
        className: "text-left",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <TopBar
          leftContent={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Accueil
            </Button>
          }
          rightContent={
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="bg-orange-500 hover:bg-orange-600 font-semibold"
            >
              Se connecter
            </Button>
          }
        />

        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 space-y-8">
              <div className="flex flex-col items-center">
                <Cloud className="h-12 w-12 text-orange-500" />
                <h2 className="mt-4 text-2xl font-bold">Créer votre compte</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Obtenez 20 Go de stockage pour 20€
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2 text-left">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Traitement en cours..."
                    : "Poursuivre mon inscription"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[440px] p-0 gap-0">
          <DialogHeader className="pt-8 pb-2 px-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center">
                <Mail className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-semibold text-center">
              Vérifiez votre email
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 py-6 space-y-6">
            <div className="space-y-3">
              <p className="text-gray-600 text-center">
                Nous avons envoyé un email de confirmation à :
              </p>
              <p className="font-medium text-lg text-center break-all">
                {registeredEmail}
              </p>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-gray-500 text-sm">
                Pour continuer votre inscription, veuillez cliquer sur le lien
                dans l'email.
              </p>
              <p className="text-orange-500 text-sm font-medium">
                Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
              </p>
            </div>
          </div>

          <div className="border-t px-8 py-6">
            <Button
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Renvoyer l'email"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
