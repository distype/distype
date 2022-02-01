import { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage, APIEmbedThumbnail } from 'discord-api-types/v9';
/**
 * A message embed; specifically, a rich embed.
 * When setting properties of the embed, this class automatically checks their length against [Discord's maximum lengths](https://discord.com/developers/docs/resources/channel#embed-limits) for embed properties.
 *
 * Methods of this class can be chained to make embed building cleaner.
 * ```ts
 * const embed = new MessageEmbed()
 *     .setTitle(`A title`)
 *     .setDescription(`Some description`)
 *     .setColor(0x5865F2);
 * ```
 * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-object)
 */
export declare class MessageEmbed {
    /**
     * The raw embed.
     */
    private _raw;
    /**
     * Create a message embed.
     * @param base An embed to use as a base.
     */
    constructor(base?: APIEmbed);
    /**
     * Set the embed's title.
     * @param title The title to use.
     */
    setTitle(title: string): this;
    /**
     * Set the embed's description.
     * @param description The description to use.
     */
    setDescription(description: string): this;
    /**
     * Set the embed's URL (makes the title clickable).
     * @param url The URL to use.
     */
    setURL(url: string): this;
    /**
     * Set the embed's timestamp.
     * @param time The time to use. Can be a unix millisecond timestamp as a number, and ISO8601 string, or a date.
     */
    setTimestamp(time?: number | string | Date): this;
    /**
     * Set the embed's color.
     * @param color The color to use.
     */
    setColor(color: number): this;
    /**
     * Set the embed's footer.
     * @param footer The footer to use. Can be either a string (adapted to `{ name: footer }`), or the footer object.
     */
    setFooter(footer: string | APIEmbedFooter): this;
    /**
     * Set the embed's image.
     * @param image The image to use. Can be either a string (adapted to `{ url: image }`), or the image object.
     */
    setImage(image: string | APIEmbedImage): this;
    /**
     * Set the embed's thumbnail.
     * @param thumbnail The thumbnail to use. Can be either a string (adapted to `{ url: thumbnail }`), or the thumbnail object.
     */
    setThumbnail(thumbnail: string | APIEmbedThumbnail): this;
    /**
     * Set the embed's author.
     * @param author The author to use. Can be either a string (adapted to `{ name: author }`), or the author object.
     */
    setAuthor(author: string | APIEmbedAuthor): this;
    /**
     * Set's the embed's fields.
     * Note that this method will overwrite any previously defined fields.
     * @param fields The fields to use.
     */
    setFields(...fields: APIEmbedField[]): this;
    /**
     * Get the raw embed.
     * Note that the returned embed is immutable.
     */
    getRaw(): APIEmbed;
    /**
     * The number of characters in the embed that have properties in [Discord's maximum embed lengths](https://discord.com/developers/docs/resources/channel#embed-limits) list.
     */
    getSize(): number;
    /**
     * Check if all properties of the embed surpass the max total characters allowed in a message.
     * Throws an error of the limit is surpassed, else nothing happens.
     */
    private _checkTotal;
}
