import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const ERICEIRA_LAT = 38.9635;
const ERICEIRA_LNG = -9.4178;

// ============================================================
// VENUE DATA — Google Places verified coordinates
// ============================================================
// 87 venues — all scraped from Google Places
const VENUES = [
  { id: 1, name: "Dom Bilas", type: "Brewpub", zone: "Old Town", lat: 38.964599, lng: -9.417891, facing: 240, elevated: false, rating: 5.0, cat: "food", tags: ["craft beer"], placeId: "ChIJNb-5RwAnHw0R-8yIL0DdJ7w" },
  { id: 2, name: "LAB", type: "Restaurant", zone: "Centro", lat: 38.9651642, lng: -9.4170493, facing: 220, elevated: false, rating: 4.9, cat: "food", tags: ["food"], placeId: "ChIJI_wFPwAnHw0RN-3EU4Szlyw" },
  { id: 3, name: "Caminito", type: "Restaurant", zone: "Centro", lat: 38.963267, lng: -9.417427, facing: 220, elevated: false, rating: 4.9, cat: "food", tags: ["food"], placeId: "ChIJHc4lVMEnHw0RETZUfUuTwQ4" },
  { id: 4, name: "Cheers Bar", type: "Bar", zone: "Centro", lat: 38.9649149, lng: -9.41724, facing: 220, elevated: false, rating: 4.9, cat: "bar", tags: ["drinks"], placeId: "ChIJv8rOjBUnHw0ROljCYC1nqus" },
  { id: 5, name: "Mother Ericeira", type: "Coffee & Co-work", zone: "Centro", lat: 38.9631425, lng: -9.4164126, facing: 210, elevated: false, rating: 4.9, cat: "cafe", tags: ["coffee"], placeId: "ChIJP6GGMzMnHw0R5pTPytpw_9U" },
  { id: 6, name: "Tiger & Chick", type: "Café", zone: "Centro", lat: 38.9637129, lng: -9.4168346, facing: 200, elevated: false, rating: 4.9, cat: "cafe", tags: ["coffee"], placeId: "ChIJHTAWjPYnHw0R70QmLlxQWPA" },
  { id: 7, name: "Mama's Caffes", type: "Coffee Roastery", zone: "Centro", lat: 38.9631583, lng: -9.4174574, facing: 220, elevated: false, rating: 4.9, cat: "cafe", tags: ["coffee"], placeId: "ChIJYZ7OJMsIcm4R6sdF8w9Kx14" },
  { id: 8, name: "Olá Ericeira", type: "Café", zone: "Rua do Mercado", lat: 38.9649304, lng: -9.416797, facing: 200, elevated: false, rating: 4.9, cat: "cafe", tags: ["coffee"], placeId: "ChIJ9dkqoRcnHw0RWE0BNI0QlGc" },
  { id: 9, name: "Petiscaria Âncora", type: "Restaurant", zone: "Largo do Cruzeiro", lat: 38.9655123, lng: -9.4186581, facing: 260, elevated: false, rating: 4.8, cat: "food", tags: ["food"], placeId: "ChIJ9c9fQfEnHw0R0lW4QAV8KjY" },
  { id: 10, name: "La Popular", type: "Wine & Tapas", zone: "Misericórdia", lat: 38.965433, lng: -9.4182822, facing: 240, elevated: false, rating: 4.8, cat: "food", tags: ["food", "wine"], placeId: "ChIJrxRCEBQnHw0RQFNnmP-SXiA" },
  { id: 11, name: "No Largo há Tasca", type: "Tasca", zone: "Centro", lat: 38.9637939, lng: -9.4171547, facing: 220, elevated: false, rating: 4.8, cat: "food", tags: ["traditional"], placeId: "ChIJEy78FkknHw0RZXkQnLsSFgY" },
  { id: 12, name: "Tasquinha dos Pescadores", type: "Tasca", zone: "Norte", lat: 38.9676075, lng: -9.4181489, facing: 280, elevated: false, rating: 4.8, cat: "food", tags: ["traditional"], placeId: "ChIJveoGxQ4nHw0Ry_8I1-Tr-FE" },
  { id: 13, name: "Villa Brunch Café", type: "Brunch", zone: "Centro", lat: 38.964825, lng: -9.417346, facing: 220, elevated: false, rating: 4.8, cat: "cafe", tags: ["brunch"], placeId: "ChIJ-U8ZwRgnHw0Rc1FCiH-VKZk" },
  { id: 14, name: "5 e Meio TapRoom", type: "Craft Beer", zone: "Centro", lat: 38.9624819, lng: -9.4175855, facing: 240, elevated: false, rating: 4.8, cat: "bar", tags: ["craft beer"], placeId: "ChIJR9fxmYMnHw0RLB_-XOL9gaY" },
  { id: 15, name: "Sr Tigre Lounge", type: "Tapas & Lounge", zone: "Centro", lat: 38.9633372, lng: -9.416584, facing: 200, elevated: false, rating: 4.8, cat: "bar", tags: ["drinks", "food"], placeId: "ChIJ_3SGRXsnHw0RC6NIrn-20O4" },
  { id: 16, name: "Pastelaria Saloia", type: "Bakery", zone: "Norte", lat: 38.9661, lng: -9.418112, facing: 280, elevated: false, rating: 4.8, cat: "cafe", tags: ["pastry"], placeId: "ChIJs1R-pg4nHw0Rp3yg-JMkcRs" },
  { id: 17, name: "La Pecora Nera", type: "Pizza", zone: "Navegantes", lat: 38.961443, lng: -9.417003, facing: 220, elevated: false, rating: 4.8, cat: "food", tags: ["pizza"], placeId: "ChIJs__5cV4nHw0RTrnyzvL2Zu8" },
  { id: 18, name: "Bocca Pizzeria Romana", type: "Pizza", zone: "Largo dos Condes", lat: 38.963834, lng: -9.416687, facing: 200, elevated: false, rating: 4.8, cat: "food", tags: ["pizza"], placeId: "ChIJS3WempEnHw0RDYQ4QCPUaTg" },
  { id: 19, name: "Mar das Latas", type: "Wine Bar", zone: "Old Town Cliffs", lat: 38.963436, lng: -9.418367, facing: 270, elevated: true, rating: 4.7, cat: "bar", tags: ["drinks", "wine", "sunset"], placeId: "ChIJG9RvYQwnHw0R0awMueZK0SQ" },
  { id: 20, name: "Barzinho", type: "Bar", zone: "Ribamar", lat: 39.005213, lng: -9.41839, facing: 290, elevated: false, rating: 4.7, cat: "bar", tags: ["drinks"], placeId: "ChIJTyGmZYwmHw0REDI3gxrMkEU" },
  { id: 21, name: "La Barraque", type: "Beach Bar", zone: "Praia do Sul", lat: 38.9543874, lng: -9.41437, facing: 270, elevated: false, rating: 4.7, cat: "bar", tags: ["drinks", "beach", "sunset"], placeId: "ChIJpYqbDMEnHw0R_HL2bDsi-4U" },
  { id: 22, name: "The Capsule", type: "Specialty Coffee", zone: "Centro", lat: 38.9642398, lng: -9.4171034, facing: 220, elevated: false, rating: 4.7, cat: "cafe", tags: ["coffee"], placeId: "ChIJO97GaignHw0RL_xxVObtEzQ" },
  { id: 23, name: "Dear Rose Café", type: "Café", zone: "Old Town", lat: 38.9639873, lng: -9.417612, facing: 240, elevated: false, rating: 4.7, cat: "cafe", tags: ["coffee"], placeId: "ChIJj00gne4nHw0Rn5kfNwsIgw4" },
  { id: 24, name: "7 Desejos", type: "Bakery & Café", zone: "Ribeira d'Ilhas", lat: 38.986504, lng: -9.415634, facing: 290, elevated: false, rating: 4.7, cat: "cafe", tags: ["coffee", "pastry", "surf"], placeId: "ChIJP_y_y_4mHw0RDYshiZGF82A" },
  { id: 25, name: "Secret Oven", type: "Pizza", zone: "Norte", lat: 38.9665074, lng: -9.4188563, facing: 280, elevated: false, rating: 4.7, cat: "food", tags: ["pizza"], placeId: "ChIJAfNI9nknHw0RWPOkZeAn9Jc" },
  { id: 26, name: "Onegai Sushi", type: "Sushi", zone: "Santa Marta", lat: 38.9613365, lng: -9.4178797, facing: 240, elevated: false, rating: 4.7, cat: "food", tags: ["asian"], placeId: "ChIJ_YML8QsnHw0RS_wBKJBARQA" },
  { id: 27, name: "Tasquinha do Patachão", type: "Tasca", zone: "Outskirts", lat: 38.9521733, lng: -9.4063482, facing: 210, elevated: false, rating: 4.7, cat: "food", tags: ["traditional"], placeId: "ChIJ42v8MBUnHw0Rpqg9fZEkBOs" },
  { id: 28, name: "Mar d'Areia", type: "Seafood", zone: "Centro", lat: 38.9646273, lng: -9.4172503, facing: 220, elevated: false, rating: 4.6, cat: "food", tags: ["food"], placeId: "ChIJr4FT9QsnHw0RRD9DCcwk98Q" },
  { id: 29, name: "Tik Tapas", type: "Tapas Bar", zone: "Centro", lat: 38.9622051, lng: -9.4177279, facing: 240, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "food"], placeId: "ChIJwZ90mQwnHw0RQDPgWmxSRYY" },
  { id: 30, name: "PRÉDIO", type: "Sushi & Rooftop", zone: "Centro", lat: 38.9636579, lng: -9.4167553, facing: 200, elevated: true, rating: 4.6, cat: "food", tags: ["asian"], placeId: "ChIJA-mUn7snHw0R0IaR6vBhJOU" },
  { id: 31, name: "Balagan", type: "Restaurant & Café", zone: "Praia do Sul", lat: 38.9586809, lng: -9.415517, facing: 270, elevated: true, rating: 4.6, cat: "cafe", tags: ["food", "coffee", "sunset"], placeId: "ChIJJ8sswvEnHw0RwyCFK4eSBlA" },
  { id: 32, name: "RIBBAÍ Ribeira d'Ilhas", type: "Beach Bar", zone: "Ribeira d'Ilhas", lat: 38.9879639, lng: -9.41813, facing: 290, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "beach", "surf"], placeId: "ChIJg22y0FQnHw0RuOXfdsg162w" },
  { id: 33, name: "Taberna Lebre", type: "Tasca", zone: "Centro", lat: 38.9637854, lng: -9.4173294, facing: 220, elevated: false, rating: 4.6, cat: "food", tags: ["traditional"], placeId: "ChIJ5aGeeAwnHw0RPJtctD6q7so" },
  { id: 34, name: "GiG - Green is Good", type: "Brunch", zone: "Misericórdia", lat: 38.9653482, lng: -9.4183953, facing: 240, elevated: true, rating: 4.6, cat: "cafe", tags: ["brunch"], placeId: "ChIJscKdGQwnHw0RcpiL0XLQ7Oo" },
  { id: 35, name: "Bar Motel", type: "Wine & Cocktail Bar", zone: "Rua do Mercado", lat: 38.9652101, lng: -9.416229, facing: 210, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "wine"], placeId: "ChIJgW-0dWY1GQ0RBz5ELYY2u2Q" },
  { id: 36, name: "Neptuno Bar", type: "Bar", zone: "Centro", lat: 38.962726, lng: -9.417183, facing: 220, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks"], placeId: "ChIJb3ZdfQsnHw0RAOpTBAlgRXY" },
  { id: 37, name: "Gadocha", type: "Bar & Café", zone: "Centro", lat: 38.9637336, lng: -9.4171464, facing: 220, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "coffee"], placeId: "ChIJiWwQhwsnHw0R3KXIirc0zns" },
  { id: 38, name: "Drop Food", type: "Beach Bar", zone: "Matadouro", lat: 38.9755462, lng: -9.419776, facing: 280, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "beach"], placeId: "ChIJ0UKN9GQnHw0Rix35MOCjXl8" },
  { id: 39, name: "O Pãozinho das Marias", type: "Bakery", zone: "Norte", lat: 38.967624, lng: -9.418901, facing: 280, elevated: false, rating: 4.6, cat: "cafe", tags: ["pastry"], placeId: "ChIJ5Tz64g4nHw0RpsCynCnSeRE" },
  { id: 40, name: "Terço do Meio", type: "Sourdough Bakery", zone: "Outskirts", lat: 38.9604528, lng: -9.414595, facing: 210, elevated: false, rating: 4.6, cat: "cafe", tags: ["pastry"], placeId: "ChIJa_A9v7onHw0Rmm0pGwmxtF8" },
  { id: 41, name: "Pizzeria Pão d'Alho", type: "Pizza", zone: "Navegantes", lat: 38.9605423, lng: -9.4151471, facing: 210, elevated: false, rating: 4.6, cat: "food", tags: ["pizza"], placeId: "ChIJFxCMzHQnHw0R3ydLJTOfUu0" },
  { id: 42, name: "Pepe Verde", type: "Pizza", zone: "Centro", lat: 38.963284, lng: -9.417568, facing: 240, elevated: false, rating: 4.6, cat: "food", tags: ["pizza"], placeId: "ChIJ48DeFesnHw0RnoqM-j1_UxU" },
  { id: 43, name: "Mar à Vista", type: "Seafood", zone: "Old Town", lat: 38.964196, lng: -9.41765, facing: 240, elevated: false, rating: 4.5, cat: "food", tags: ["food"], placeId: "ChIJEdJxEgwnHw0RLXR87iJ5g8Y" },
  { id: 44, name: "COSTA FRIA", type: "Restaurant", zone: "Cliffs", lat: 38.9619626, lng: -9.4189398, facing: 270, elevated: true, rating: 4.5, cat: "food", tags: ["food", "sunset"], placeId: "ChIJf_CTQ4InHw0R4wIHh_9y-Og" },
  { id: 45, name: "Brunch Me", type: "Brunch", zone: "Navegantes", lat: 38.9607989, lng: -9.4164693, facing: 210, elevated: false, rating: 4.5, cat: "cafe", tags: ["brunch"], placeId: "ChIJCQ5pCgwnHw0RgxbyATpUwa8" },
  { id: 46, name: "Sunset Bamboo", type: "Café & Burritos", zone: "Centro", lat: 38.9630698, lng: -9.416783, facing: 200, elevated: false, rating: 4.5, cat: "cafe", tags: ["coffee", "sunset"], placeId: "ChIJq1Z6eQsnHw0RToKOAo96mCs" },
  { id: 47, name: "Nalu Bowls", type: "Café & Bowls", zone: "Navegantes", lat: 38.9602941, lng: -9.4167272, facing: 200, elevated: false, rating: 4.5, cat: "cafe", tags: ["coffee"], placeId: "ChIJl15VrnQnHw0RNSIefH0O8Eg" },
  { id: 48, name: "Jukebox Bar", type: "Cocktail Bar", zone: "Centro", lat: 38.962078, lng: -9.41753, facing: 240, elevated: false, rating: 4.5, cat: "bar", tags: ["drinks"], placeId: "ChIJ52JqnwwnHw0R14JJQA54OBQ" },
  { id: 49, name: "Adega Bar 1987", type: "Bar", zone: "Old Town", lat: 38.9623073, lng: -9.418189, facing: 240, elevated: false, rating: 4.5, cat: "bar", tags: ["drinks"], placeId: "ChIJEbYxlwwnHw0RYHsQNsdje44" },
  { id: 50, name: "Hemingway's", type: "Cocktail Bar", zone: "Centro", lat: 38.962051, lng: -9.417543, facing: 240, elevated: false, rating: 4.5, cat: "bar", tags: ["drinks"], placeId: "ChIJS1A2nwwnHw0R3hogv4fzJhQ" },
  { id: 51, name: "Mar de Café", type: "Café", zone: "N247", lat: 38.9588697, lng: -9.4146418, facing: 210, elevated: false, rating: 4.5, cat: "cafe", tags: ["coffee"], placeId: "ChIJM7qf_XQnHw0RuCKIzqJpgOI" },
  { id: 52, name: "Croissanteria da Vila", type: "Bakery", zone: "Largo dos Condes", lat: 38.9639867, lng: -9.4168586, facing: 200, elevated: false, rating: 4.5, cat: "cafe", tags: ["pastry"], placeId: "ChIJxwguozcnHw0RsVDr9pWoWm0" },
  { id: 53, name: "Mizu", type: "Asian Fusion", zone: "Navegantes", lat: 38.961425, lng: -9.416513, facing: 200, elevated: false, rating: 4.5, cat: "food", tags: ["asian"], placeId: "ChIJL7tql84nHw0RLWIBAGgh3KA" },
  { id: 54, name: "Tasca da Fonte Boa", type: "Tasca", zone: "Outskirts", lat: 38.972862, lng: -9.397301, facing: 210, elevated: false, rating: 4.5, cat: "food", tags: ["traditional"], placeId: "ChIJL-NzkpcnHw0RVX4ZcmliTnk" },
  { id: 55, name: "Tasquinha do Joy", type: "Tasca", zone: "Old Town", lat: 38.9645637, lng: -9.4178599, facing: 240, elevated: false, rating: 4.4, cat: "food", tags: ["traditional"], placeId: "ChIJCd8DcAwnHw0RmaMMf0BoicQ" },
  { id: 56, name: "Esplanada Furnas", type: "Seafood", zone: "Furnas", lat: 38.9614111, lng: -9.4196764, facing: 270, elevated: true, rating: 4.4, cat: "food", tags: ["food"], placeId: "ChIJ5VLY2wwnHw0RP_uRJQ5YzTM" },
  { id: 57, name: "A Panela", type: "Restaurant", zone: "Santa Marta", lat: 38.9613174, lng: -9.418036, facing: 240, elevated: false, rating: 4.4, cat: "food", tags: ["food"], placeId: "ChIJh5oKsAwnHw0RUafE1GF-OuA" },
  { id: 58, name: "Uni Sushi", type: "Sushi", zone: "Largo dos Condes", lat: 38.9638889, lng: -9.4169444, facing: 200, elevated: false, rating: 4.4, cat: "food", tags: ["asian"], placeId: "ChIJHUQ5hgsnHw0RBlUT3qdEdRE" },
  { id: 59, name: "7Janelas Brewery", type: "Brewpub", zone: "Centro", lat: 38.9642628, lng: -9.4173653, facing: 220, elevated: false, rating: 4.4, cat: "food", tags: ["craft beer"], placeId: "ChIJbatydgwnHw0RUo9z6hCz8dY" },
  { id: 60, name: "Ouriço Terrace", type: "Bar & Club", zone: "Pescadores", lat: 38.9623784, lng: -9.418625, facing: 270, elevated: true, rating: 4.4, cat: "bar", tags: ["drinks"], placeId: "ChIJ00jUNp8nHw0RU_n-Kf3yAXg" },
  { id: 61, name: "Casa da Fernanda", type: "Café & Bakery", zone: "Pescadores", lat: 38.964687, lng: -9.417883, facing: 270, elevated: false, rating: 4.4, cat: "cafe", tags: ["coffee", "pastry"], placeId: "ChIJpS1lDQwnHw0RE4KU4OqKljY" },
  { id: 62, name: "Pastelaria 7", type: "Bakery & Café", zone: "São Sebastião", lat: 38.9695555, lng: -9.419473, facing: 260, elevated: false, rating: 4.4, cat: "cafe", tags: ["coffee", "pastry"], placeId: "ChIJ6UHLcg8nHw0RbL--XaXLZeo" },
  { id: 63, name: "Pedra Dura", type: "Restaurant", zone: "Centro", lat: 38.962165, lng: -9.416387, facing: 210, elevated: false, rating: 4.3, cat: "food", tags: ["food"], placeId: "ChIJQ3LMaQsnHw0RZWwPO1KPN_8" },
  { id: 64, name: "Pão da Vila 2", type: "Bakery", zone: "Norte", lat: 38.9684819, lng: -9.4177512, facing: 280, elevated: false, rating: 4.3, cat: "cafe", tags: ["pastry"], placeId: "ChIJG5zQKQ8nHw0RiS-m6Sq8RTM" },
  { id: 65, name: "Ti Matilde", type: "Seafood", zone: "Praia do Norte", lat: 38.96933, lng: -9.41988, facing: 270, elevated: false, rating: 4.2, cat: "food", tags: ["food", "sunset"], placeId: "ChIJtQEmCw8nHw0R1OfHzHsmaic" },
  { id: 66, name: "Tubo Bar", type: "Bar", zone: "Old Town", lat: 38.9638904, lng: -9.4173783, facing: 220, elevated: false, rating: 4.2, cat: "bar", tags: ["drinks"], placeId: "ChIJrYA7eAwnHw0RQhRha7phF2s" },
  { id: 67, name: "Algodio Beach Club", type: "Beach Bar", zone: "Praia do Norte", lat: 38.9675258, lng: -9.4199031, facing: 270, elevated: false, rating: 4.2, cat: "bar", tags: ["drinks", "beach", "sunset"], placeId: "ChIJg_9h-Q4nHw0RJ-iopBF1088" },
  { id: 68, name: "O Pãozinho (Praça)", type: "Bakery & Café", zone: "Praça", lat: 38.9632401, lng: -9.416861, facing: 200, elevated: false, rating: 4.2, cat: "cafe", tags: ["coffee", "pastry"], placeId: "ChIJHZ7EeAsnHw0R2IFjYsl4oFA" },
  { id: 69, name: "Pão da Vila", type: "Bakery & Café", zone: "Praça", lat: 38.9633891, lng: -9.4170239, facing: 220, elevated: false, rating: 4.2, cat: "cafe", tags: ["coffee", "pastry"], placeId: "ChIJrV1JCV0nHw0R_CNWM8kq_vg" },
  { id: 70, name: "Gota d'Álcool", type: "Beach Bar", zone: "São Julião", lat: 38.9327963, lng: -9.4192322, facing: 280, elevated: false, rating: 4.1, cat: "bar", tags: ["drinks", "beach"], placeId: "ChIJF0VORYTYHg0RnXMf117PENw" },
  { id: 71, name: "Lucky Star", type: "Asian / Sushi", zone: "Navegantes", lat: 38.9614409, lng: -9.4157371, facing: 210, elevated: false, rating: 4.1, cat: "food", tags: ["asian"], placeId: "ChIJsRYyZMHXHg0Re2lckgd96RM" },
  { id: 72, name: "HOWM", type: "Ramen & Asian", zone: "Outskirts", lat: 38.965117, lng: -9.414591, facing: 210, elevated: false, rating: 4.1, cat: "food", tags: ["asian"], placeId: "ChIJnTBBG7cnHw0RgyJKADO-kK8" },
  { id: 73, name: "Indigo", type: "Beach Restaurant", zone: "Foz do Lizandro", lat: 38.9424765, lng: -9.414745, facing: 260, elevated: false, rating: 4.0, cat: "food", tags: ["food", "beach"], placeId: "ChIJU6YPO4EnHw0RnzN0sREV_wk" },
  { id: 74, name: "Pão da Vila Central", type: "Bakery & Brunch", zone: "Praça", lat: 38.963545, lng: -9.417239, facing: 220, elevated: false, rating: 4.0, cat: "cafe", tags: ["pastry", "brunch"], placeId: "ChIJlzRmInwnHw0RWR8JFlaawHE" },
  { id: 75, name: "Sebastião Bar", type: "Beach Bar", zone: "São Sebastião", lat: 38.9728583, lng: -9.4197101, facing: 260, elevated: false, rating: 3.6, cat: "bar", tags: ["drinks", "beach"], placeId: "ChIJW8HLqAUnHw0RidCW_i7Kt88" },
  // — Talay —
  { id: 76, name: "Talay Thai House", type: "Thai", zone: "São Sebastião", lat: 38.9691968, lng: -9.4193783, facing: 270, elevated: false, rating: 4.5, cat: "food", tags: ["asian"], placeId: "ChIJtVWYw2MnHw0RCYSBpImK0hU" },
  // — Foz do Lizandro —
  { id: 77, name: "Lizandro Surf Restaurant", type: "Beach Bar", zone: "Foz do Lizandro", lat: 38.942030, lng: -9.414542, facing: 260, elevated: false, rating: 4.6, cat: "bar", tags: ["drinks", "beach", "surf"], placeId: "ChIJ3zH_O7gnHw0RPgmZVhagRVo" },
  { id: 78, name: "Naonda", type: "Restaurant & Bar", zone: "Foz do Lizandro", lat: 38.941699, lng: -9.414021, facing: 260, elevated: false, rating: 4.1, cat: "food", tags: ["food", "beach", "surf"], placeId: "ChIJQ7oDyH8nHw0RmxiweuSXhkw" },
  // — Ribamar —
  { id: 79, name: "Marisqueira de Ribamar", type: "Seafood", zone: "Ribamar", lat: 39.0058784, lng: -9.4203081, facing: 280, elevated: false, rating: 4.5, cat: "food", tags: ["food", "traditional"], placeId: "ChIJw7tGyo0mHw0R9wH1fmrnXSE" },
  { id: 80, name: "O Pescador", type: "Seafood", zone: "Ribamar", lat: 39.0060282, lng: -9.4183032, facing: 280, elevated: false, rating: 4.6, cat: "food", tags: ["food", "traditional"], placeId: "ChIJmcBzFIwmHw0RXY-2iT1E0Jk" },
  { id: 81, name: "Café Vitória", type: "Restaurant & Café", zone: "Ribamar", lat: 39.0052389, lng: -9.4188748, facing: 280, elevated: false, rating: 4.4, cat: "food", tags: ["food", "coffee", "traditional"], placeId: "ChIJV_vPxmg3Hw0R9fhrfwTIYq4" },
  { id: 82, name: "O Spot", type: "Café & Brunch", zone: "Ribamar", lat: 39.0070814, lng: -9.4190229, facing: 280, elevated: false, rating: 4.5, cat: "cafe", tags: ["coffee", "brunch"], placeId: "ChIJ0fDA3pYnHw0RjELQsoaTS1c" },
  { id: 83, name: "O Rochedo", type: "Seafood", zone: "Ribamar", lat: 39.0065208, lng: -9.4187734, facing: 280, elevated: false, rating: 4.6, cat: "food", tags: ["food", "traditional"], placeId: "ChIJNy5nGowmHw0RQMpZZf-WSPY" },
  { id: 84, name: "Originale Pasta", type: "Italian", zone: "Ribamar", lat: 39.003107, lng: -9.418258, facing: 280, elevated: false, rating: 4.9, cat: "food", tags: ["pizza"], placeId: "ChIJW2jAagAnHw0RujUuDEPkkzM" },
  // — Santo Isidoro —
  { id: 85, name: "Vizinha", type: "Café & Farm Shop", zone: "Santo Isidoro", lat: 38.9936067, lng: -9.3968182, facing: 210, elevated: false, rating: 4.7, cat: "cafe", tags: ["coffee"], placeId: "ChIJvbM2C7AnHw0RHj1HWj3b_fA" },
  { id: 86, name: "19 prás 2", type: "Tea House & Bakery", zone: "Santo Isidoro", lat: 38.9925873, lng: -9.3954352, facing: 210, elevated: false, rating: 5.0, cat: "cafe", tags: ["coffee", "pastry"], placeId: "ChIJeReu6rUnHw0RcEoX9kie4yM" },
  // — Missing from Centro —
  { id: 87, name: "Com Pinta", type: "Burger & Pizza", zone: "Centro", lat: 38.9621767, lng: -9.4165678, facing: 200, elevated: false, rating: 4.4, cat: "food", tags: ["food"], placeId: "ChIJjy3oZwsnHw0RoKwSou61Em0" },
];

// ============================================================
// SUN MATH
// ============================================================
function getSunPosition(date, lat, lng) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const hours = date.getHours() + date.getMinutes() / 60;
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const B = rad * (360 / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const LSTM = 15 * Math.round(lng / 15);
  const LST = hours + (4 * (lng - LSTM) + EoT) / 60;
  const HRA = 15 * (LST - 12);
  const sinAlt = Math.sin(rad * lat) * Math.sin(rad * declination) + Math.cos(rad * lat) * Math.cos(rad * declination) * Math.cos(rad * HRA);
  const altitude = Math.asin(sinAlt) / rad;
  const cosAz = (Math.sin(rad * declination) - Math.sin(rad * altitude) * Math.sin(rad * lat)) / (Math.cos(rad * altitude) * Math.cos(rad * lat));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) / rad;
  if (HRA > 0) azimuth = 360 - azimuth;
  let golden = 0;
  if (altitude > 0 && altitude < 10) golden = 1 - altitude / 10;
  return { altitude, azimuth, golden, isDay: altitude > 0, intensity: Math.max(0, Math.min(1, altitude / 15)) };
}

function getSunrise(date, lat) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const dec = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const cosHA = -Math.tan(rad * lat) * Math.tan(rad * dec);
  if (cosHA < -1 || cosHA > 1) return { sunrise: 6, sunset: 18 };
  const HA = Math.acos(cosHA) / rad;
  return { sunrise: 12 - HA / 15, sunset: 12 + HA / 15 };
}

// ============================================================
// 3D SHADOW ENGINE
// ============================================================
// Converts lat/lng to meters relative to a reference point
const METERS_PER_DEG_LAT = 111320;
const METERS_PER_DEG_LNG = 111320 * Math.cos((ERICEIRA_LAT * Math.PI) / 180);

function toMeters(lat, lng) {
  return {
    x: (lng - ERICEIRA_LNG) * METERS_PER_DEG_LNG,
    y: (lat - ERICEIRA_LAT) * METERS_PER_DEG_LAT,
  };
}

// Compute shadow polygon from a building polygon given sun altitude and azimuth
function computeShadowPolygon(buildingCoords, heightM, sunAltDeg, sunAzDeg) {
  if (sunAltDeg <= 0) return null;
  const rad = Math.PI / 180;
  // Shadow length in meters
  const shadowLen = heightM / Math.tan(sunAltDeg * rad);
  // Shadow direction (opposite of sun azimuth)
  const shadowAz = ((sunAzDeg + 180) % 360) * rad;
  const dx = shadowLen * Math.sin(shadowAz);
  const dy = shadowLen * Math.cos(shadowAz);

  // Shadow polygon = building footprint + offset footprint
  const offset = buildingCoords.map((c) => ({ x: c.x + dx, y: c.y + dy }));
  // Convex hull of building + shadow tip
  const allPoints = [...buildingCoords, ...offset];
  return convexHull(allPoints);
}

// Simple convex hull (Graham scan)
function convexHull(points) {
  if (points.length < 3) return points;
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (O, A, B) => (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pts[i]) <= 0) upper.pop();
    upper.push(pts[i]);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

// Point-in-polygon test
function pointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Compute shadow penalty for a venue given buildings + sun
function computeShadowPenalty(venueLat, venueLng, buildings, sunAlt, sunAz) {
  if (sunAlt <= 0 || buildings.length === 0) return 0;
  const vPt = toMeters(venueLat, venueLng);
  let maxPenalty = 0;

  for (const bld of buildings) {
    const shadow = computeShadowPolygon(bld.coordsM, bld.height, sunAlt, sunAz);
    if (shadow && pointInPolygon(vPt.x, vPt.y, shadow)) {
      // Also check venue isn't inside the building footprint itself
      if (!pointInPolygon(vPt.x, vPt.y, bld.coordsM)) {
        // Penalty scales with building height — tall buildings cast harder shadows
        const penalty = Math.min(1, bld.height / 15);
        maxPenalty = Math.max(maxPenalty, penalty);
      }
    }
  }
  return maxPenalty;
}

// ============================================================
// OSM BUILDING FETCHER
// ============================================================
async function fetchOSMBuildings() {
  const bbox = "38.958,-9.422,38.975,-9.412";
  const query = `[out:json][timeout:30];(way["building"](${bbox}););out body;>;out skel qt;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const elements = data.elements || [];
    const nodes = {};
    elements.forEach((e) => {
      if (e.type === "node") nodes[e.id] = e;
    });

    const buildings = [];
    elements.forEach((e) => {
      if (e.type !== "way" || !e.tags?.building) return;
      const coords = (e.nodes || [])
        .map((nid) => nodes[nid])
        .filter(Boolean)
        .map((n) => ({ lat: n.lat, lng: n.lon }));
      if (coords.length < 3) return;

      const levels = parseInt(e.tags["building:levels"]) || null;
      const heightTag = parseFloat(e.tags["height"]) || null;
      // Estimate height: use tag, or levels * 3m, or default 8m (typical Ericeira 2-3 floors)
      const height = heightTag || (levels ? levels * 3 : 8);
      const coordsM = coords.map((c) => toMeters(c.lat, c.lng));

      buildings.push({ id: e.id, coords, coordsM, height, levels, tags: e.tags });
    });

    console.log(`[Shadow Engine] Loaded ${buildings.length} buildings from OSM`);
    return buildings;
  } catch (err) {
    console.warn("[Shadow Engine] OSM fetch failed, using fallback:", err.message);
    return null;
  }
}

// ============================================================
// FALLBACK BUILDING DATA — key structures near venues
// hand-mapped from satellite imagery of Ericeira old town
// Each entry: [lat, lng] pairs forming polygon + estimated height
// ============================================================
const FALLBACK_BUILDINGS = [
  // Block east of Mar das Latas / Ouriço — Rua Capitão João Lopes
  { coords: [{ lat: 38.9636, lng: -9.4181 }, { lat: 38.9636, lng: -9.4179 }, { lat: 38.9634, lng: -9.4179 }, { lat: 38.9634, lng: -9.4181 }], height: 10 },
  { coords: [{ lat: 38.9638, lng: -9.4182 }, { lat: 38.9638, lng: -9.4180 }, { lat: 38.9636, lng: -9.4180 }, { lat: 38.9636, lng: -9.4182 }], height: 9 },
  // Block around Tubo Bar / Tasquinha do Joy area
  { coords: [{ lat: 38.9647, lng: -9.4177 }, { lat: 38.9647, lng: -9.4174 }, { lat: 38.9644, lng: -9.4174 }, { lat: 38.9644, lng: -9.4177 }], height: 11 },
  { coords: [{ lat: 38.9644, lng: -9.4177 }, { lat: 38.9644, lng: -9.4175 }, { lat: 38.9641, lng: -9.4175 }, { lat: 38.9641, lng: -9.4177 }], height: 9 },
  // Block north of Tik Tapas / Hemingway's — Rua do Ericeira
  { coords: [{ lat: 38.9623, lng: -9.4178 }, { lat: 38.9623, lng: -9.4175 }, { lat: 38.9620, lng: -9.4175 }, { lat: 38.9620, lng: -9.4178 }], height: 10 },
  { coords: [{ lat: 38.9623, lng: -9.4175 }, { lat: 38.9623, lng: -9.4172 }, { lat: 38.9620, lng: -9.4172 }, { lat: 38.9620, lng: -9.4175 }], height: 12 },
  // Block behind 7Janelas / PRÉDIO — Rua 5 de Outubro
  { coords: [{ lat: 38.9645, lng: -9.4173 }, { lat: 38.9645, lng: -9.4170 }, { lat: 38.9642, lng: -9.4170 }, { lat: 38.9642, lng: -9.4173 }], height: 10 },
  { coords: [{ lat: 38.9642, lng: -9.4170 }, { lat: 38.9642, lng: -9.4167 }, { lat: 38.9639, lng: -9.4167 }, { lat: 38.9639, lng: -9.4170 }], height: 9 },
  // Largo dos Condes block (Uni Sushi / Sr Tigre area)
  { coords: [{ lat: 38.9640, lng: -9.4168 }, { lat: 38.9640, lng: -9.4165 }, { lat: 38.9637, lng: -9.4165 }, { lat: 38.9637, lng: -9.4168 }], height: 10 },
  { coords: [{ lat: 38.9637, lng: -9.4168 }, { lat: 38.9637, lng: -9.4165 }, { lat: 38.9634, lng: -9.4165 }, { lat: 38.9634, lng: -9.4168 }], height: 8 },
  // La Popular / Misericórdia block
  { coords: [{ lat: 38.9656, lng: -9.4184 }, { lat: 38.9656, lng: -9.4181 }, { lat: 38.9653, lng: -9.4181 }, { lat: 38.9653, lng: -9.4184 }], height: 11 },
  { coords: [{ lat: 38.9653, lng: -9.4181 }, { lat: 38.9653, lng: -9.4178 }, { lat: 38.9650, lng: -9.4178 }, { lat: 38.9650, lng: -9.4181 }], height: 9 },
  // Casa da Fernanda / Largo das Ribas area
  { coords: [{ lat: 38.9649, lng: -9.4180 }, { lat: 38.9649, lng: -9.4177 }, { lat: 38.9646, lng: -9.4177 }, { lat: 38.9646, lng: -9.4180 }], height: 10 },
  // Rua Dr. Eduardo Burnay — Pedra Dura area
  { coords: [{ lat: 38.9624, lng: -9.4166 }, { lat: 38.9624, lng: -9.4163 }, { lat: 38.9621, lng: -9.4163 }, { lat: 38.9621, lng: -9.4166 }], height: 10 },
  { coords: [{ lat: 38.9621, lng: -9.4166 }, { lat: 38.9621, lng: -9.4163 }, { lat: 38.9618, lng: -9.4163 }, { lat: 38.9618, lng: -9.4166 }], height: 9 },
  // Adega 1987 / Jukebox strip — Rua Alves Crespo
  { coords: [{ lat: 38.9625, lng: -9.4184 }, { lat: 38.9625, lng: -9.4181 }, { lat: 38.9622, lng: -9.4181 }, { lat: 38.9622, lng: -9.4184 }], height: 9 },
  // Ti Matilde area — R. Dr. Manuel Arriaga
  { coords: [{ lat: 38.9695, lng: -9.4200 }, { lat: 38.9695, lng: -9.4197 }, { lat: 38.9692, lng: -9.4197 }, { lat: 38.9692, lng: -9.4200 }], height: 10 },
  { coords: [{ lat: 38.9692, lng: -9.4200 }, { lat: 38.9692, lng: -9.4197 }, { lat: 38.9689, lng: -9.4197 }, { lat: 38.9689, lng: -9.4200 }], height: 8 },
  // Sebastião Bar promenade — buildings to the east
  { coords: [{ lat: 38.9730, lng: -9.4195 }, { lat: 38.9730, lng: -9.4192 }, { lat: 38.9727, lng: -9.4192 }, { lat: 38.9727, lng: -9.4195 }], height: 7 },
  // Bar Motel area — Rua do Mercado
  { coords: [{ lat: 38.9654, lng: -9.4164 }, { lat: 38.9654, lng: -9.4161 }, { lat: 38.9651, lng: -9.4161 }, { lat: 38.9651, lng: -9.4164 }], height: 10 },
  // 5 e Meio / Tik Tapas block
  { coords: [{ lat: 38.9626, lng: -9.4178 }, { lat: 38.9626, lng: -9.4175 }, { lat: 38.9624, lng: -9.4175 }, { lat: 38.9624, lng: -9.4178 }], height: 10 },
  // Balagan — Praia do Sul cliffside buildings (sparse)
  { coords: [{ lat: 38.9590, lng: -9.4157 }, { lat: 38.9590, lng: -9.4154 }, { lat: 38.9587, lng: -9.4154 }, { lat: 38.9587, lng: -9.4157 }], height: 6 },
  // Algodio Beach Club — minimal nearby structures
  { coords: [{ lat: 38.9677, lng: -9.4200 }, { lat: 38.9677, lng: -9.4197 }, { lat: 38.9674, lng: -9.4197 }, { lat: 38.9674, lng: -9.4200 }], height: 5 },
].map((b) => ({
  ...b,
  coordsM: b.coords.map((c) => toMeters(c.lat, c.lng)),
}));

// ============================================================
// SCORE CALCULATION WITH SHADOWS
// ============================================================
function getVenueSunScore(venue, sun, buildings) {
  if (!sun.isDay) return { score: 0, shadowPenalty: 0, baseScore: 0 };
  let diff = Math.abs(venue.facing - sun.azimuth);
  if (diff > 180) diff = 360 - diff;
  let score = Math.max(0, 1 - diff / 100);
  if (sun.golden > 0 && venue.facing >= 200 && venue.facing <= 310) score = Math.min(1, score + sun.golden * 0.5);
  if (venue.elevated) score = Math.min(1, score * 1.3 + 0.1);
  else if (sun.altitude < 15) score *= 0.6 + (sun.altitude / 15) * 0.4;
  if (venue.facing >= 240 && venue.facing <= 300 && sun.azimuth >= 230) score = Math.min(1, score * 1.2);
  let baseScore = Math.max(0, Math.min(1, score * sun.intensity));

  // Apply shadow penalty
  const shadowPenalty = computeShadowPenalty(venue.lat, venue.lng, buildings, sun.altitude, sun.azimuth);
  // Elevated venues (rooftops) are above most shadows
  const effectivePenalty = venue.elevated ? shadowPenalty * 0.2 : shadowPenalty;
  const finalScore = baseScore * (1 - effectivePenalty * 0.85);

  return { score: Math.max(0, Math.min(1, finalScore)), shadowPenalty: effectivePenalty, baseScore };
}

// ============================================================
// HELPERS
// ============================================================
function formatTime(h) { let hr = Math.floor(h) % 24; if (hr < 0) hr += 24; const m = Math.round((h - Math.floor(h)) * 60) % 60; const p = hr >= 12 ? "PM" : "AM"; const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr; return `${h12}:${String(Math.abs(m)).padStart(2, "0")} ${p}`; }
function getTimeLabel(sun) { if (sun.golden > 0.3) return "Golden Hour"; if (!sun.isDay) return "Night"; if (sun.altitude < 20) return sun.azimuth < 180 ? "Early Morning" : "Late Afternoon"; return sun.azimuth < 180 ? "Morning" : "Afternoon"; }
function getWeatherIcon(code, cloud) {
  // WMO weather codes: https://open-meteo.com/en/docs
  if (code === null || code === undefined) return null;
  if (code >= 95) return "⛈️"; // thunderstorm
  if (code >= 80) return "🌧️"; // rain showers
  if (code >= 71) return "🌨️"; // snow
  if (code >= 61) return "🌧️"; // rain
  if (code >= 51) return "🌦️"; // drizzle
  if (code >= 45) return "🌫️"; // fog
  if (cloud !== null && cloud > 80) return "☁️";
  if (cloud !== null && cloud > 50) return "🌥️";
  if (cloud !== null && cloud > 20) return "⛅";
  return "☀️";
}
function getWeatherLabel(code, cloud) {
  if (code === null) return "";
  if (code >= 95) return "Storms";
  if (code >= 80) return "Showers";
  if (code >= 71) return "Snow";
  if (code >= 61) return "Rain";
  if (code >= 51) return "Drizzle";
  if (code >= 45) return "Foggy";
  if (cloud !== null && cloud > 80) return "Overcast";
  if (cloud !== null && cloud > 50) return "Mostly cloudy";
  if (cloud !== null && cloud > 20) return "Partly cloudy";
  return "Clear";
}
function getDirectionsLink(v) { return `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}&destination_place_id=${v.placeId}&travelmode=walking`; }
function getMapsLink(v) { return `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}&query_place_id=${v.placeId}`; }

// ============================================================
// MAP WITH SHADOW OVERLAY
// ============================================================
function MapView({ venues, scores, selectedId, onSelect, buildings, sun }) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);
  const shadowLayerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(css);
    const js = document.createElement("script"); js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; js.onload = () => setReady(true); document.head.appendChild(js);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapObjRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center: [ERICEIRA_LAT, ERICEIRA_LNG], zoom: 16, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "", maxZoom: 19 }).addTo(map);
    mapObjRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);
  }, [ready]);

  // Draw shadow polygons on map
  useEffect(() => {
    if (!mapObjRef.current || !window.L || !sun.isDay) return;
    const L = window.L;
    const map = mapObjRef.current;

    if (shadowLayerRef.current) map.removeLayer(shadowLayerRef.current);

    const shadowGroup = L.layerGroup();
    const rad = Math.PI / 180;

    buildings.forEach((bld) => {
      if (sun.altitude <= 1) return;
      const shadowLen = bld.height / Math.tan(sun.altitude * rad);
      const shadowAz = ((sun.azimuth + 180) % 360) * rad;
      const dLat = (shadowLen * Math.cos(shadowAz)) / METERS_PER_DEG_LAT;
      const dLng = (shadowLen * Math.sin(shadowAz)) / METERS_PER_DEG_LNG;

      const coords = bld.coords.map((c) => [c.lat, c.lng]);
      const shadowCoords = bld.coords.map((c) => [c.lat + dLat, c.lng + dLng]);
      // Merge to form shadow polygon (simplified: convex hull of both)
      const allLL = [...coords, ...shadowCoords];

      // Draw building footprint
      L.polygon(coords, {
        color: "rgba(180, 160, 120, 0.3)",
        fillColor: "rgba(180, 160, 120, 0.15)",
        weight: 0.5,
        fillOpacity: 0.15,
      }).addTo(shadowGroup);

      // Draw shadow
      L.polygon(allLL, {
        color: "transparent",
        fillColor: "rgba(0, 0, 20, 0.35)",
        weight: 0,
        fillOpacity: 0.35,
      }).addTo(shadowGroup);
    });

    shadowGroup.addTo(map);
    shadowLayerRef.current = shadowGroup;
  }, [buildings, sun]);

  // Track previous selectedId to know when selection actually changed
  const prevSelectedRef = useRef(null);

  // Update venue markers
  useEffect(() => {
    if (!mapObjRef.current || !window.L) return;
    const L = window.L; const map = mapObjRef.current;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const selectionChanged = prevSelectedRef.current !== selectedId;
    prevSelectedRef.current = selectedId;

    venues.forEach((v) => {
      const { score, shadowPenalty } = scores[v.id] || { score: 0, shadowPenalty: 0 };
      const isSel = v.id === selectedId;
      const color = score > 0.55 ? "#e8a840" : score > 0.2 ? "#8b6a2f" : "#555";
      const sz = isSel ? 18 : score > 0.55 ? 14 : score > 0.2 ? 10 : 7;
      const glow = score > 0.55 ? `box-shadow:0 0 ${isSel ? 25 : 18}px ${color}90,0 0 ${isSel ? 40 : 30}px ${color}40;` : score > 0.2 ? `box-shadow:0 0 8px ${color}50;` : "";

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};border:${isSel ? "2.5px solid #f4d48a" : "1.5px solid " + color + "80"};${glow}transform:translate(-50%,-50%);transition:all 0.3s;"></div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([v.lat, v.lng], { icon, zIndexOffset: isSel ? 1000 : Math.round(score * 100) }).addTo(map);

      const statusText = score > 0.55 ? `☀️ Full Sun ${Math.round(score * 100)}%` : score > 0.2 ? `🌤 Partial ${Math.round(score * 100)}%` : "🌑 Shade";
      const shadowNote = shadowPenalty > 0.3 ? `<div style="font-size:10px;color:#c44;margin-bottom:6px;">🏢 Building shadow detected (${Math.round(shadowPenalty * 100)}% blocked)</div>` : shadowPenalty > 0 ? `<div style="font-size:10px;color:#886;margin-bottom:6px;">🏢 Light shadow (${Math.round(shadowPenalty * 100)}% blocked)</div>` : "";

      marker.bindPopup(
        `<div style="font-family:-apple-system,system-ui,sans-serif;min-width:160px;padding:4px 0;">
          <div style="font-size:15px;font-weight:600;color:#1a1a2e;margin-bottom:1px;">${v.name}</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">${v.type} · ${v.zone}</div>
          <div style="font-size:13px;font-weight:500;margin-bottom:6px;color:${color};">${statusText}</div>
          ${shadowNote}
          <a href="${getMapsLink(v)}" target="_blank" rel="noopener" style="display:block;text-align:center;font-size:12px;font-weight:600;color:#fff;background:#e8a840;text-decoration:none;padding:8px 12px;border-radius:8px;">Open in Google Maps</a>
        </div>`,
        { className: "custom-popup", maxWidth: 220 }
      );

      // Only pan and open popup when the user actually tapped a new venue
      if (isSel && selectionChanged) { marker.openPopup(); map.panTo([v.lat, v.lng], { animate: true }); }
      marker.on("click", () => onSelect(v.id));
      markersRef.current.push(marker);
    });
  }, [venues, scores, selectedId, onSelect]);

  useEffect(() => {
    const h = () => mapObjRef.current?.invalidateSize();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return <div ref={mapRef} className="w-full h-full" style={{ background: "#0d0d14" }} />;
}

// ============================================================
// SUN DIAL
// ============================================================
function SunDial({ sun }) {
  const progress = sun.azimuth ? Math.max(0, Math.min(1, (sun.azimuth - 80) / 200)) : 0.5;
  const angle = Math.PI - progress * Math.PI;
  const sx = 50 + 42 * Math.cos(angle);
  const sy = 50 - 42 * Math.sin(angle) * 0.6;
  const col = sun.golden > 0.3 ? "#f4a020" : sun.isDay ? "#f0d060" : "#334";
  return (
    <svg viewBox="0 0 100 55" className="w-full" style={{ maxWidth: 170 }}>
      <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(240,232,216,0.12)" strokeWidth="0.5" />
      <path d="M 8 50 Q 50 -10 92 50" fill="none" stroke="rgba(240,232,216,0.06)" strokeWidth="0.5" strokeDasharray="2,2" />
      {sun.isDay && <circle cx={sx} cy={sy} r={sun.golden > 0.3 ? 8 : 4} fill={col} opacity="0.15" />}
      <circle cx={sx} cy={sy} r="3" fill={col} />
      <text x="6" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5">E</text>
      <text x="89" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5">W</text>
    </svg>
  );
}

// ============================================================
// VENUE CARD
// ============================================================
// Compute sun scores across the whole day for a venue
function computeDayTimeline(venue, buildings, date, weatherData) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const dec = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const cosHA = -Math.tan(rad * ERICEIRA_LAT) * Math.tan(rad * dec);
  const HA = Math.acos(Math.max(-1, Math.min(1, cosHA))) / rad;
  const sunriseH = 12 - HA / 15;
  const sunsetH = 12 + HA / 15;
  
  const cc = weatherData?.cloudCover || [];
  const wTimes = weatherData?.times || [];
  const points = [];
  let peakScore = 0, peakTime = 12;
  for (let m = Math.floor(sunriseH * 60); m <= Math.ceil(sunsetH * 60); m += 10) {
    const d = new Date(date);
    d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    const sun = getSunPosition(d, ERICEIRA_LAT, ERICEIRA_LNG);
    let { score } = getVenueSunScore(venue, sun, buildings);
    // Apply cloud cover — look up from weather times array
    if (cc.length > 0 && wTimes.length > 0) {
      // Convert m (minutes in the day) to offset from today midnight
      const todayMid = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const offsetMin = Math.floor((d - todayMid) / 60000);
      // Find nearest weather data point
      let i = 0;
      while (i < wTimes.length - 1 && wTimes[i + 1] < offsetMin) i++;
      let cloud = cc[i] || 0;
      if (i < wTimes.length - 1 && wTimes[i + 1] > wTimes[i]) {
        const frac = Math.max(0, Math.min(1, (offsetMin - wTimes[i]) / (wTimes[i + 1] - wTimes[i])));
        cloud = cc[i] * (1 - frac) + cc[i + 1] * frac;
      }
      score *= 1 - (cloud / 100) * 0.85;
    }
    points.push({ m, score });
    if (score > peakScore) { peakScore = score; peakTime = m; }
  }
  return { points, peakScore, peakTime, sunriseM: Math.floor(sunriseH * 60), sunsetM: Math.ceil(sunsetH * 60) };
}

function SunTimeline({ venue, buildings, currentMinutes, onTimeClick, weather }) {
  const timeline = useMemo(() => computeDayTimeline(venue, buildings, new Date(), weather), [venue, buildings, weather]);
  const { points, peakScore, peakTime, sunriseM, sunsetM } = timeline;
  
  if (points.length === 0) return null;
  
  const w = 280, h = 48, pad = 2;
  const range = sunsetM - sunriseM;
  const xScale = (m) => pad + ((m - sunriseM) / range) * (w - 2 * pad);
  const yScale = (s) => h - pad - s * (h - 2 * pad);
  
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.m).toFixed(1)},${yScale(p.score).toFixed(1)}`).join(" ");
  const areaD = pathD + ` L${xScale(points[points.length - 1].m).toFixed(1)},${h - pad} L${xScale(points[0].m).toFixed(1)},${h - pad} Z`;
  
  const cursorX = xScale(Math.max(sunriseM, Math.min(sunsetM, currentMinutes)));
  const currentScore = points.reduce((best, p) => Math.abs(p.m - currentMinutes) < Math.abs(best.m - currentMinutes) ? p : best, points[0]);
  const peakX = xScale(peakTime);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const m = Math.round(sunriseM + pct * range);
    onTimeClick(Math.max(sunriseM, Math.min(sunsetM, m)));
  };

  return (
    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-wider text-stone-500">Sun timeline — tap to jump</span>
        {peakScore > 0.3 && (
          <button onClick={(e) => { e.stopPropagation(); onTimeClick(peakTime); }} className="text-[9px] uppercase tracking-wider text-amber-400/70 hover:text-amber-400 transition-colors">
            Peak: {formatTime(peakTime / 60)} ({Math.round(peakScore * 100)}%)
          </button>
        )}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full cursor-pointer" style={{ height: 48 }} onClick={handleClick}>
        {/* Golden hour zones */}
        <defs>
          <linearGradient id="sunFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e8a840" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e8a840" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaD} fill="url(#sunFill)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#e8a840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        {/* Peak marker */}
        {peakScore > 0.3 && <circle cx={peakX} cy={yScale(peakScore)} r="2.5" fill="#f4c362" opacity="0.6" />}
        {/* Current time cursor */}
        <line x1={cursorX} y1={pad} x2={cursorX} y2={h - pad} stroke="#fff" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
        <circle cx={cursorX} cy={yScale(currentScore.score)} r="3" fill={currentScore.score > 0.55 ? "#e8a840" : currentScore.score > 0.2 ? "#8b6a2f" : "#555"} stroke="#fff" strokeWidth="1" />
      </svg>
      <div className="flex justify-between text-[8px] text-stone-600 mt-0.5 px-0.5">
        <span>{formatTime(sunriseM / 60)}</span>
        <span>noon</span>
        <span>{formatTime(sunsetM / 60)}</span>
      </div>
    </div>
  );
}

function VenueCard({ venue, scoreData, isSelected, onClick, buildings, currentMinutes, onTimeClick, weather }) {
  const { score, shadowPenalty, baseScore } = scoreData;
  const pct = Math.round(score * 100);
  const col = score > 0.55 ? "#e8a840" : score > 0.2 ? "#8b6a2f" : "rgba(240,232,216,0.25)";

  return (
    <button onClick={onClick} className={`w-full text-left transition-all duration-200 rounded-xl border px-3 py-2.5 ${isSelected ? "border-amber-500/40 bg-amber-900/15" : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08]"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col, boxShadow: score > 0.55 ? `0 0 8px ${col}60` : "none" }} />
            <h3 className="text-[13px] font-medium text-stone-200 truncate">{venue.name}</h3>
            {venue.rating >= 4.7 && <span className="text-[9px] text-amber-500/60">★</span>}
          </div>
          <p className="text-[10px] text-stone-500 ml-4 truncate">{venue.type} · {venue.zone}</p>
        </div>
        <div className="text-right flex-shrink-0 min-w-[40px]">
          <div className="text-base font-light" style={{ color: col }}>{pct}%</div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-2.5 ml-4">
          {/* Sun Timeline */}
          <SunTimeline venue={venue} buildings={buildings} currentMinutes={currentMinutes} onTimeClick={onTimeClick} weather={weather} />
          {/* Shadow note — only if significant */}
          {shadowPenalty > 0.3 && (
            <p className="text-[9px] text-stone-600 mb-2">🏢 {Math.round(shadowPenalty * 100)}% building shadow{venue.elevated ? " (reduced — rooftop)" : ""}</p>
          )}
          {/* Single CTA — Google Maps */}
          <a href={getMapsLink(venue)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-1.5 w-full text-xs font-medium px-3 py-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-colors">
            Open in Google Maps
          </a>
        </div>
      )}
    </button>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  // Time is now an absolute offset in minutes from today 00:00
  // Range: -720 (yesterday noon) to +2160 (tomorrow midnight)
  // This lets user scrub from today's sunrise through tomorrow's sunset
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentOffset = Math.floor((now - todayMidnight) / 60000); // minutes since midnight
  const [timeOffset, setTimeOffset] = useState(currentOffset);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [buildings, setBuildings] = useState(FALLBACK_BUILDINGS);
  const [buildingSource, setBuildingSource] = useState("fallback");
  const [weather, setWeather] = useState(null);

  // Fetch real OSM buildings on mount
  useEffect(() => {
    fetchOSMBuildings().then((osm) => {
      if (osm && osm.length > 10) {
        setBuildings(osm);
        setBuildingSource("osm");
      }
    });
  }, []);

  // Fetch 3-day weather from Open-Meteo (yesterday + today + tomorrow)
  useEffect(() => {
    const yesterday = new Date(todayMidnight);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(todayMidnight);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDate = yesterday.toISOString().split("T")[0];
    const endDate = tomorrow.toISOString().split("T")[0];
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ERICEIRA_LAT}&longitude=${ERICEIRA_LNG}&hourly=cloud_cover,weather_code&timezone=Europe/Lisbon&start_date=${startDate}&end_date=${endDate}`)
      .then(r => r.json())
      .then(data => {
        if (data?.hourly) {
          // Parse ISO times to minute offsets from today midnight
          const times = (data.hourly.time || []).map(t => {
            const d = new Date(t);
            return Math.floor((d - todayMidnight) / 60000);
          });
          setWeather({
            cloudCover: data.hourly.cloud_cover || [],
            weatherCode: data.hourly.weather_code || [],
            times, // minute offsets from today midnight
          });
        }
      })
      .catch(() => {});
  }, []);

  // Convert offset to Date
  const currentDate = useMemo(() => {
    return new Date(todayMidnight.getTime() + timeOffset * 60000);
  }, [timeOffset]);

  // Which day label
  const dayLabel = useMemo(() => {
    const d = currentDate.getDate();
    const today = todayMidnight.getDate();
    if (d === today) return "Today";
    const tomorrow = new Date(todayMidnight);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d === tomorrow.getDate()) return "Tomorrow";
    return "Yesterday";
  }, [currentDate]);

  const sun = useMemo(() => getSunPosition(currentDate, ERICEIRA_LAT, ERICEIRA_LNG), [currentDate]);
  const { sunrise, sunset } = useMemo(() => getSunrise(currentDate, ERICEIRA_LAT), [currentDate]);

  // Slider range: today sunrise-30 through tomorrow sunset+30
  const todaySunrise = useMemo(() => {
    const { sunrise: sr } = getSunrise(new Date(todayMidnight), ERICEIRA_LAT);
    return Math.floor(sr * 60) - 30;
  }, []);
  const tomorrowSunset = useMemo(() => {
    const tom = new Date(todayMidnight);
    tom.setDate(tom.getDate() + 1);
    const { sunset: ss } = getSunrise(tom, ERICEIRA_LAT);
    return 1440 + Math.ceil(ss * 60) + 30; // 1440 = tomorrow offset
  }, []);

  // Get cloud cover for current time offset (interpolated from weather data)
  const cloudCover = useMemo(() => {
    if (!weather?.cloudCover?.length || !weather.times?.length) return null;
    const t = timeOffset;
    const times = weather.times;
    const cc = weather.cloudCover;
    // Find surrounding data points
    let i = 0;
    while (i < times.length - 1 && times[i + 1] < t) i++;
    if (i >= times.length - 1) return cc[cc.length - 1] || 0;
    if (times[i] >= t) return cc[i] || 0;
    const frac = (t - times[i]) / (times[i + 1] - times[i]);
    return cc[i] * (1 - frac) + cc[i + 1] * frac;
  }, [weather, timeOffset]);

  // Weather code for current time
  const currentWeatherCode = useMemo(() => {
    if (!weather?.weatherCode?.length || !weather.times?.length) return null;
    const t = timeOffset;
    const times = weather.times;
    // Find nearest hour
    let closest = 0;
    for (let i = 1; i < times.length; i++) {
      if (Math.abs(times[i] - t) < Math.abs(times[closest] - t)) closest = i;
    }
    return weather.weatherCode[closest];
  }, [weather, timeOffset]);

  // Cloud multiplier: 0% cloud = 1.0, 100% cloud = 0.15
  const cloudMultiplier = cloudCover !== null ? 1 - (cloudCover / 100) * 0.85 : 1;

  const scores = useMemo(() => {
    const s = {};
    VENUES.forEach((v) => {
      const raw = getVenueSunScore(v, sun, buildings);
      s[v.id] = {
        ...raw,
        score: raw.score * cloudMultiplier,
        baseScore: raw.baseScore,
        cloudCover: cloudCover,
      };
    });
    return s;
  }, [sun, buildings, cloudMultiplier, cloudCover]);

  const sortedVenues = useMemo(() => {
    let f = [...VENUES];
    if (filter === "sunlit") f = f.filter((v) => scores[v.id]?.score > 0.4);
    if (filter === "bars") f = f.filter((v) => v.cat === "bar");
    if (filter === "food") f = f.filter((v) => v.cat === "food");
    if (filter === "cafe") f = f.filter((v) => v.cat === "cafe");
    if (filter === "beach") f = f.filter((v) => v.tags.includes("beach") || v.tags.includes("sunset"));
    if (filter === "pizza") f = f.filter((v) => v.tags.includes("pizza"));
    if (filter === "tasca") f = f.filter((v) => v.tags.includes("traditional"));
    return f.sort((a, b) => (scores[b.id]?.score || 0) - (scores[a.id]?.score || 0));
  }, [scores, filter]);

  // Bottom sheet state for mobile (snap points: peek=18vh, half=50vh, full=85vh)
  const [sheetHeight, setSheetHeight] = useState(50);
  const dragRef = useRef({ startY: 0, startH: 0, dragging: false });

  const onDragStart = useCallback((e) => {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startY: y, startH: sheetHeight, dragging: true };
  }, [sheetHeight]);

  const onDragMove = useCallback((e) => {
    if (!dragRef.current.dragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = dragRef.current.startY - y;
    const deltaVh = (delta / window.innerHeight) * 100;
    const newH = Math.max(18, Math.min(90, dragRef.current.startH + deltaVh));
    setSheetHeight(newH);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const h = sheetHeight;
    if (h < 30) setSheetHeight(18);
    else if (h < 70) setSheetHeight(50);
    else setSheetHeight(85);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  }, [sheetHeight]);

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] text-stone-200 overflow-hidden relative" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:flex h-full flex-row">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView venues={VENUES} scores={scores} selectedId={selectedId} onSelect={setSelectedId} buildings={buildings} sun={sun} />
        </div>
        {/* Side panel */}
        <div className="flex flex-col w-[360px] xl:w-[400px] bg-[#0a0a0f] border-l border-white/[0.06] overflow-hidden flex-shrink-0">
          <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-1">
            <div>
              <h1 className="text-lg font-light tracking-tight">Ericeira <span style={{ color: "#e8a840" }}>Golden Hour</span></h1>
              <p className="text-[9px] uppercase tracking-[0.15em] text-stone-500 -mt-0.5">the sun guide to Ericeira</p>
            </div>
          </div>
          <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/[0.04]">
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-light" style={{ color: sun.golden > 0.3 ? "#e8a840" : sun.isDay ? "#c8c0b0" : "#555" }}>{formatTime(timeOffset / 60)}</div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500">{dayLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {weather && <span className="text-sm">{getWeatherIcon(currentWeatherCode, cloudCover)}</span>}
                <div className="text-[10px] uppercase tracking-wider" style={{ color: sun.golden > 0.3 ? "rgba(232,168,64,0.7)" : "rgba(160,150,140,0.4)" }}>
                  {weather ? getWeatherLabel(currentWeatherCode, cloudCover) : getTimeLabel(sun)}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(to right, #1a1a2e 0%, #e8a840 25%, #f4c362 50%, #e8a840 75%, #1a1a2e 100%)", opacity: 0.3 }} />
              {/* Day separator mark at midnight */}
              <div className="absolute h-3 top-1/2 -translate-y-1/2 border-l border-white/20 z-[5]" style={{ left: `${((1440 - todaySunrise) / (tomorrowSunset - todaySunrise)) * 100}%` }} />
              <input type="range" min={todaySunrise} max={tomorrowSunset} value={timeOffset} onChange={(e) => setTimeOffset(Number(e.target.value))} className="w-full relative z-10 bg-transparent cursor-pointer h-6" style={{ WebkitAppearance: "none", appearance: "none" }} />
              <div className="flex justify-between text-[9px] text-stone-600 -mt-0.5 px-1">
                <span>Today ☀️</span><span>Tomorrow ☀️</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex gap-1 px-3 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {[{ key: "all", label: "All" }, { key: "sunlit", label: "☀️ Sun" }, { key: "food", label: "Food" }, { key: "bars", label: "Bars" }, { key: "cafe", label: "Coffee" }, { key: "beach", label: "Beach" }, { key: "pizza", label: "Pizza" }, { key: "tasca", label: "Tasca" }].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)} className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${filter === key ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/[0.03] text-stone-500 border border-white/[0.05] hover:bg-white/[0.06]"}`}>{label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(232,168,64,0.15) transparent" }}>
            {sortedVenues.length === 0 ? (
              <div className="text-center py-12 text-stone-600"><p className="text-xs">No venues match this filter</p></div>
            ) : sortedVenues.map((v) => (
              <VenueCard key={v.id} venue={v} scoreData={scores[v.id] || { score: 0, shadowPenalty: 0, baseScore: 0 }} isSelected={selectedId === v.id} onClick={() => setSelectedId(selectedId === v.id ? null : v.id)} buildings={buildings} currentMinutes={timeOffset} onTimeClick={setTimeOffset} weather={weather} />
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT — fullscreen map + bottom sheet */}
      <div className="lg:hidden h-full relative">
        {/* Fullscreen map */}
        <div className="absolute inset-0">
          <MapView venues={VENUES} scores={scores} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); if (sheetHeight < 30) setSheetHeight(50); }} buildings={buildings} sun={sun} />
        </div>

        {/* Bottom sheet */}
        <div
          className="absolute left-0 right-0 bottom-0 bg-[#0a0a0f] rounded-t-2xl border-t border-white/[0.08] flex flex-col overflow-hidden z-[600]"
          style={{ height: `${sheetHeight}vh`, transition: dragRef.current.dragging ? "none" : "height 0.3s ease-out" }}
        >
          {/* Drag handle */}
          <div
            className="flex-shrink-0 flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}
            onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mb-1.5" />
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-light" style={{ color: sun.golden > 0.3 ? "#e8a840" : sun.isDay ? "#c8c0b0" : "#555" }}>
                  {formatTime(timeOffset / 60)}
                </span>
                {weather && <span className="text-sm">{getWeatherIcon(currentWeatherCode, cloudCover)}</span>}
                <span className="text-[9px] uppercase tracking-wider text-stone-500">{dayLabel}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider" style={{ color: sun.golden > 0.3 ? "rgba(232,168,64,0.6)" : "rgba(160,150,140,0.3)" }}>
                {weather ? getWeatherLabel(currentWeatherCode, cloudCover) : getTimeLabel(sun)}
              </span>
            </div>
          </div>

          {/* Time slider */}
          <div className="flex-shrink-0 px-4 pb-1">
            <div className="relative">
              <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(to right, #1a1a2e 0%, #e8a840 25%, #f4c362 50%, #e8a840 75%, #1a1a2e 100%)", opacity: 0.3 }} />
              <div className="absolute h-3 top-1/2 -translate-y-1/2 border-l border-white/20 z-[5]" style={{ left: `${((1440 - todaySunrise) / (tomorrowSunset - todaySunrise)) * 100}%` }} />
              <input type="range" min={todaySunrise} max={tomorrowSunset} value={timeOffset} onChange={(e) => setTimeOffset(Number(e.target.value))} className="w-full relative z-10 bg-transparent cursor-pointer h-6" style={{ WebkitAppearance: "none", appearance: "none" }} />
              <div className="flex justify-between text-[9px] text-stone-600 -mt-0.5 px-1">
                <span>Today</span><span>Tomorrow</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex-shrink-0 flex gap-1 px-3 py-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {[{ key: "all", label: "All" }, { key: "sunlit", label: "☀️ Sun" }, { key: "food", label: "Food" }, { key: "bars", label: "Bars" }, { key: "cafe", label: "Coffee" }, { key: "beach", label: "Beach" }, { key: "pizza", label: "Pizza" }, { key: "tasca", label: "Tasca" }].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)} className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${filter === key ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/[0.03] text-stone-500 border border-white/[0.05] hover:bg-white/[0.06]"}`}>{label}</button>
            ))}
          </div>

          {/* Venue list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(232,168,64,0.15) transparent" }}>
            {sortedVenues.length === 0 ? (
              <div className="text-center py-8 text-stone-600"><p className="text-xs">No venues match this filter</p></div>
            ) : sortedVenues.map((v) => (
              <VenueCard key={v.id} venue={v} scoreData={scores[v.id] || { score: 0, shadowPenalty: 0, baseScore: 0 }} isSelected={selectedId === v.id} onClick={() => setSelectedId(selectedId === v.id ? null : v.id)} buildings={buildings} currentMinutes={timeOffset} onTimeClick={setTimeOffset} weather={weather} />
            ))}
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style>{`input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#e8a840;box-shadow:0 0 16px rgba(232,168,64,0.5);border:2px solid #f4d48a;cursor:grab}input[type="range"]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#e8a840;box-shadow:0 0 16px rgba(232,168,64,0.5);border:2px solid #f4d48a;cursor:grab}.leaflet-popup-content-wrapper{border-radius:12px!important;box-shadow:0 8px 30px rgba(0,0,0,0.3)!important}.leaflet-popup-tip{display:none!important}`}</style>
    </div>
  );
}
