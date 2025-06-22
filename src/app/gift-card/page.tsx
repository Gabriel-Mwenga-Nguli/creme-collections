
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Gift, Send, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { generateGiftCardContent, type GenerateGiftCardContentInput, type GenerateGiftCardContentOutput } from '@/ai/flows/generate-gift-card-flow';
import { generateImage, type GenerateImageInput, type GenerateImageOutput } from '@/ai/flows/generate-image-flow';
import { createGiftCard } from '@/services/giftCardService';
import { SITE_NAME } from '@/lib/constants';

interface GeneratedCard {
  message: string;
  imageUrl: string;
}

export default function GiftCardPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    amount: '2500',
    occasion: 'Birthday',
  });
  const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePreview = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedCard(null);
    toast({ title: "AI is thinking...", description: "Generating a personalized gift card for you." });
    try {
      const contentInput: GenerateGiftCardContentInput = {
        recipientName: formData.recipientName,
        senderName: formData.senderName,
        occasion: formData.occasion,
        amount: Number(formData.amount),
      };
      const contentOutput = await generateGiftCardContent(contentInput);
      
      toast({ title: "Creating design...", description: "Your personalized message is ready, now creating the visuals." });
      
      const imageInput: GenerateImageInput = { prompt: contentOutput.designPrompt };
      const imageOutput = await generateImage(imageInput);

      setGeneratedCard({
        message: contentOutput.message,
        imageUrl: imageOutput.imageUrl,
      });

      toast({ title: "Preview Ready!", description: "Your personalized gift card is ready to be purchased." });
    } catch (error) {
      console.error("Error generating gift card:", error);
      toast({ title: "Generation Failed", description: "The AI could not create a gift card. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePurchase = async () => {
    if (!generatedCard) {
        toast({title: "No Gift Card", description: "Please generate a gift card preview first.", variant: "destructive"});
        return;
    }
    setIsPurchasing(true);
    toast({ title: "Processing...", description: "Finalizing your gift card purchase." });
    try {
        const giftCardId = await createGiftCard({
            recipientEmail: formData.recipientEmail,
            senderName: formData.senderName,
            amount: Number(formData.amount),
            message: generatedCard.message,
            designImageUrl: generatedCard.imageUrl,
        });

        if (giftCardId) {
            toast({ title: "Success!", description: "Your gift card has been purchased and will be sent shortly.", duration: 7000 });
            setFormData({ recipientName: '', recipientEmail: '', senderName: '', amount: '2500', occasion: 'Birthday' });
            setGeneratedCard(null);
        } else {
            throw new Error("Failed to save gift card to the database.");
        }
    } catch (error) {
        console.error("Error purchasing gift card:", error);
        toast({ title: "Purchase Failed", description: "Could not complete the purchase. Please try again.", variant: "destructive" });
    } finally {
        setIsPurchasing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">AI-Powered Gift Cards</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Create a unique and personalized gift card for any occasion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">1. Create Your Gift Card</CardTitle>
              <CardDescription>Fill in the details and let our AI do the rest.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneratePreview} className="space-y-4">
                <div>
                  <Label htmlFor="senderName">Your Name</Label>
                  <Input id="senderName" name="senderName" value={formData.senderName} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="recipientName">Recipient's Name</Label>
                  <Input id="recipientName" name="recipientName" value={formData.recipientName} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="recipientEmail">Recipient's Email</Label>
                  <Input id="recipientEmail" name="recipientEmail" type="email" value={formData.recipientEmail} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Select name="amount" value={formData.amount} onValueChange={(value) => handleSelectChange('amount', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">KES 1,000</SelectItem>
                        <SelectItem value="2500">KES 2,500</SelectItem>
                        <SelectItem value="5000">KES 5,000</SelectItem>
                        <SelectItem value="10000">KES 10,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="occasion">Occasion</Label>
                    <Select name="occasion" value={formData.occasion} onValueChange={(value) => handleSelectChange('occasion', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Thank You">Thank You</SelectItem>
                        <SelectItem value="Christmas">Christmas</SelectItem>
                        <SelectItem value="Congratulations">Congratulations</SelectItem>
                        <SelectItem value="Just Because">Just Because</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Generate AI Preview
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6 sticky top-24">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">2. Preview & Purchase</CardTitle>
                <CardDescription>Your personalized gift card will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating && (
                  <div className="aspect-[1.586] bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="font-semibold">Generating your card...</p>
                    <p className="text-sm text-center">This can take up to 30 seconds.</p>
                  </div>
                )}
                {!isGenerating && generatedCard && (
                    <div className="aspect-[1.586] w-full relative rounded-lg overflow-hidden shadow-lg group">
                        <Image src={generatedCard.imageUrl} alt="AI Generated Gift Card Design" layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col p-4 text-white">
                           <h3 className="font-headline text-xl font-bold">{SITE_NAME} Gift Card</h3>
                           <div className="flex-grow flex items-center justify-center">
                                <p className="text-center text-sm leading-relaxed backdrop-blur-sm bg-black/30 p-2 rounded-md">
                                    {generatedCard.message}
                                </p>
                           </div>
                           <p className="text-right font-bold text-2xl">KES {Number(formData.amount).toLocaleString()}</p>
                        </div>
                    </div>
                )}
                 {!isGenerating && !generatedCard && (
                  <div className="aspect-[1.586] bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4">
                    <ImageIcon className="h-10 w-10 mb-4" />
                    <p className="font-semibold">Your Preview Awaits</p>
                    <p className="text-sm text-center">Fill out the form and click generate.</p>
                  </div>
                )}
                 <Button onClick={handlePurchase} className="w-full mt-4" size="lg" disabled={!generatedCard || isPurchasing || isGenerating}>
                    {isPurchasing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Purchase & Send
                 </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
