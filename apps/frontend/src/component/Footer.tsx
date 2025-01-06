import Button from "./ui/Button";

const Footer = () => {
  return (
    <div className="w-screen bg-black text-blue-50">
      <div className="w-[1180px] mx-auto p-10 flex justify-center gap-20">
        <div className="flex gap-10">
          <div>
            <div className="text-xl font-bold mb-4">PixelVerse</div>
            <Tile text={"About"} />
          </div>
          <div>
            <div className="text-xl font-bold mb-4">Contact</div>
            <Tile text={"Github"} />
            <Tile text={"Twitter"} />
            <Tile text={"LinkedIn"} />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold mb-4">
            Your Feedback is valuable
          </div>
          <textarea
            name="feedback"
            id="feedback"
            placeholder="feedback"
            className="bg-white outline-none w-[300px] h-[200px] rounded-lg p-4 text-sm text-black"
          ></textarea>
          <Button text="Sunmit" type="secondary" />
        </div>
      </div>
      <div className="text-center pb-5 text-gray-300">Made by Dhaneshwar</div>
    </div>
  );
};

export default Footer;

const Tile = ({ text }: { text: string }) => {
  return (
    <div className="text-gray-400 hover:underline cursor-pointer">{text}</div>
  );
};
