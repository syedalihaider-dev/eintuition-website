"use client";

import { useEffect } from "react";

export default function ClientBoot({ children }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return children;
}
