import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import TopBar from "@/components/layout/TopBar";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
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

  return (
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
          <Link
            to="/"
            className="flex items-center text-orange-500 hover:text-orange-600 mr-2"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white mr-2">
              <Cloud className="size-5" />
            </div>
            <span className="font-bold">JMK Cloud</span>
          </Link>
        }
      />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-8">
            <div className="flex flex-col items-center">
              <Cloud className="h-12 w-12 text-orange-500" />
              <h2 className="mt-4 text-2xl font-bold">Connexion</h2>
              <p className="text-sm text-gray-500 mt-2">
                Connectez-vous pour accéder à votre espace.
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
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4">
              Pas encore de compte ?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-orange-500 cursor-pointer font-medium hover:underline"
              >
                Inscrivez-vous
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
