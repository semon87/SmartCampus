import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation"; // Adjust import path if needed

import {
  Container,
  Typography,
  Box,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";

const photos = [
  {
    img: "https://source.unsplash.com/600x400/?food",
    title: "Delicious Food",
  },
  {
    img: "https://source.unsplash.com/600x400/?campus",
    title: "Campus View",
  },
  {
    img: "https://source.unsplash.com/600x400/?students",
    title: "Students",
  },
];

export default function Home() {
  return (
    <>
      {/* Pass minimal={true} so only registration/login show on Home page */}
      <Navigation minimal={true} />

      <Container maxWidth="sm" sx={{ mt: 6, mb: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom fontWeight="light">
          Welcome to Smart Campus Ordering
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Easy food ordering for students and vendors on campus.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="medium"
            sx={{ px: 4 }}
          >
            Login
          </Button>
        </Box>

        {/* Minimal image gallery */}
        <ImageList cols={1} gap={12} rowHeight={240}>
          {photos.map((item) => (
            <ImageListItem key={item.img}>
              <img
                src={`${item.img}&auto=format&fit=crop&w=600&q=80`}
                alt={item.title}
                loading="lazy"
                style={{ borderRadius: 8 }}
              />
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {item.title}
              </Typography>
            </ImageListItem>
          ))}
        </ImageList>
      </Container>
    </>
  );
}
