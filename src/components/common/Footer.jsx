import { Footer as FooterComponent, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function Footer() {
  return (
    <FooterComponent className="rounded-xl" container>
      <FooterCopyright href="#" by="Wabascript" year={2025} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Licensing</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
      </FooterLinkGroup>
    </FooterComponent>
  );
}
