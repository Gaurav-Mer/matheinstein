"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';

interface RazorpayFormData {
    keyId: string;
    keySecret: string;
}

interface RazorpayConnectDialogProps {
    onConnectionSuccess: () => void;
}

export const RazorpayConnectDialog = ({ onConnectionSuccess }: RazorpayConnectDialogProps) => {
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<RazorpayFormData>();

    const onSubmit = async (data: RazorpayFormData) => {
        try {
            await api.post('/admin/integrations/razorpay/connect', data);
            onConnectionSuccess();
            // You might want to close the dialog here. This requires managing open state from the parent.
        } catch (error) {
            console.error("Failed to connect Razorpay account", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Connect</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect Razorpay</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="keyId" className="text-right">
                                Key ID
                            </Label>
                            <Input
                                id="keyId"
                                className="col-span-3"
                                {...register('keyId', { required: 'Key ID is required' })}
                            />
                            {errors.keyId && <p className="col-span-4 text-red-500 text-sm">{errors.keyId.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="keySecret" className="text-right">
                                Key Secret
                            </Label>
                            <Input
                                id="keySecret"
                                type="password"
                                className="col-span-3"
                                {...register('keySecret', { required: 'Key Secret is required' })}
                            />
                            {errors.keySecret && <p className="col-span-4 text-red-500 text-sm">{errors.keySecret.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Connection'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};