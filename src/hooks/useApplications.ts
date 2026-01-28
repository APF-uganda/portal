import { useEffect, useState } from "react";
import { Application } from "../types/Application";
import { fetchApplications } from "../services/applicationApi";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications().then((data: Application[]) => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  return { applications, loading };
};