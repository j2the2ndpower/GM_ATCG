var cardId = argument0, card = ds_map_create();

if (ds_map_exists(global.cards, cardId)) {
    ds_map_copy(card, global.cards[? cardId]);
}

return card;
