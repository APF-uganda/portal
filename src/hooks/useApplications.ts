import { useEffect, useState } from "react";
import { Application } from "../types/Application";
import { fetchApplications } from "../services/applications";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications().then((data) => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  return { applications, loading };
};